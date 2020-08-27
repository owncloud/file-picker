def main(ctx):
  before = [
    tests(ctx),
    changelog(ctx),
    website(ctx),
  ]

  stages = [
    release(ctx),
  ]

  after = [
    notify(),
  ]

  return before + stages + after

def changelog(ctx):
  repo_slug = ctx.build.source_repo if ctx.build.source_repo else ctx.repo.slug
  return {
    'kind': 'pipeline',
    'type': 'docker',
    'name': 'changelog',
    'platform': {
      'os': 'linux',
      'arch': 'amd64',
    },
    'clone': {
      'disable': True,
    },
    'steps': [
      {
        'name': 'clone',
        'image': 'plugins/git-action:1',
        'pull': 'always',
        'settings': {
          'actions': [
            'clone',
          ],
          'remote': 'https://github.com/%s' % (repo_slug),
          'branch': ctx.build.source if ctx.build.event == 'pull_request' else 'master',
          'path': '/drone/src',
          'netrc_machine': 'github.com',
          'netrc_username': {
            'from_secret': 'github_username',
          },
          'netrc_password': {
            'from_secret': 'github_token',
          },
        },
      },
      {
        'name': 'generate',
        'image': 'webhippie/golang:1.13',
        'pull': 'always',
        'commands': [
          'make changelog',
        ],
      },
      {
        'name': 'diff',
        'image': 'owncloud/alpine:latest',
        'pull': 'always',
        'commands': [
          'git diff',
        ],
      },
      {
        'name': 'output',
        'image': 'owncloud/alpine:latest',
        'pull': 'always',
        'commands': [
          'cat CHANGELOG.md',
        ],
      },
      {
        'name': 'publish',
        'image': 'plugins/git-action:1',
        'pull': 'always',
        'settings': {
          'actions': [
            'commit',
            'push',
          ],
          'message': 'Automated changelog update [skip ci]',
          'branch': 'master',
          'author_email': 'devops@owncloud.com',
          'author_name': 'ownClouders',
          'netrc_machine': 'github.com',
          'netrc_username': {
            'from_secret': 'github_username',
          },
          'netrc_password': {
            'from_secret': 'github_token',
          },
        },
        'when': {
          'ref': {
            'exclude': [
              'refs/pull/**',
            ],
          },
        },
      },
    ],
    'trigger': {
      'ref': [
        'refs/heads/master',
        'refs/pull/**',
      ],
    },
  }

def website(ctx):
  return {
    'kind': 'pipeline',
    'type': 'docker',
    'name': 'website',
    'platform': {
      'os': 'linux',
      'arch': 'amd64',
    },
    'steps': [
      {
        'name': 'prepare',
        'image': 'owncloudci/alpine:latest',
        'commands': [
          'make docs-copy'
        ],
      },
      {
        'name': 'test',
        'image': 'webhippie/hugo:latest',
        'commands': [
          'cd hugo',
          'hugo',
        ],
      },
      {
        'name': 'list',
        'image': 'owncloudci/alpine:latest',
        'commands': [
          'tree hugo/public',
        ],
      },
      {
        'name': 'publish',
        'image': 'plugins/gh-pages:1',
        'pull': 'always',
        'settings': {
          'username': {
            'from_secret': 'github_username',
          },
          'password': {
            'from_secret': 'github_token',
          },
          'pages_directory': 'docs/',
          'target_branch': 'docs',
        },
        'when': {
          'ref': {
            'exclude': [
              'refs/pull/**',
            ],
          },
        },
      },
      {
        'name': 'downstream',
        'image': 'plugins/downstream',
        'settings': {
          'server': 'https://cloud.drone.io/',
          'token': {
            'from_secret': 'drone_token_cloud',
          },
          'repositories': [
            'owncloud/owncloud.github.io@source',
          ],
        },
        'when': {
          'ref': {
            'exclude': [
              'refs/pull/**',
            ],
          },
        },
      },
    ],
    'trigger': {
      'ref': [
        'refs/heads/master',
        'refs/pull/**',
      ],
    },
  }

def notify():
  return {
    'kind': 'pipeline',
    'type': 'docker',
    'name': 'chat-notification',
    'clone': {
      'disable': True
    },
    'steps': [
      {
        'name': 'notify-rocketchat',
        'image': 'plugins/slack:1',
        'pull': 'always',
        'settings': {
          'webhook': {
            'from_secret': 'private_rocketchat'
          },
          'channel': 'builds'
        }
      },
    ],
    'trigger': {
      'ref': [
        'refs/tags/**'
      ],
      'status': [
        'success',
        'failure'
      ]
    },
  }

def tests(ctx):
  return {
    'kind': 'pipeline',
    'type': 'docker',
    'name': 'tests',
    'platform': {
      'os': 'linux',
      'arch': 'amd64',
    },
    'steps': [
      {
        'name': 'install',
        'image': 'owncloudci/nodejs:11',
        'pull': 'always',
        'commands': [
          'yarn install --frozen-lockfile',
        ],
      },
      {
        'name': 'lint',
        'image': 'owncloudci/nodejs:11',
        'pull': 'always',
        'commands': [
          'yarn lint',
        ],
      },
      {
        'name': 'build',
        'image': 'owncloudci/nodejs:11',
        'pull': 'always',
        'commands': [
          'yarn build',
        ],
      },
    ],
    'trigger': {
      'ref': [
        'refs/heads/master',
        'refs/tags/**',
        'refs/pull/**',
      ],
    },
  }

def release(ctx):
  return {
    'kind': 'pipeline',
    'type': 'docker',
    'name': 'release',
    'platform': {
      'os': 'linux',
      'arch': 'amd64',
    },
    'steps': [
      {
        'name': 'build',
        'image': 'owncloudci/nodejs:11',
        'pull': 'always',
        'commands': [
          'yarn install --frozen-lockfile',
          'yarn build'
        ]
      },
      {
        'name': 'publish-github',
        'image': 'plugins/github-release:latest',
        'pull': 'always',
        'settings': {
          'api_key': {
            'from_secret': 'github_token',
          },
          'title': ctx.build.ref.replace("refs/tags/v", ""),
          'note': 'dist/CHANGELOG.md',
          'overwrite': True,
        },
        'trigger': {
          'ref': [
            'refs/tags/**',
          ],
        },
      },
      {
        'name': 'publish-npm',
        'image': 'plugins/npm:latest',
        'pull': 'always',
        'settings': {
          'username': {
            'from_secret': 'npm_username',
          },
          'email': {
            'from_secret': 'npm_email',
          },
          'token': {
            'from_secret': 'npm_token',
          },
        }
      },
    ],
    'depends_on': [
      'tests'
    ],
    'trigger': {
      'ref': [
        'refs/tags/**',
      ],
    },
  }
