config = {
	'app': 'file-picker',
	'rocketchat': {
		'channel': 'builds',
		'from_secret': 'private_rocketchat'
	},

	'branches': [
		'master'
  ]
}

def main(ctx):
	before = beforePipelines(ctx)

	stages = stagePipelines(ctx)
	if (stages == False):
		print('Errors detected. Review messages above.')
		return []

	dependsOn(before, stages)

	after = afterPipelines(ctx)
	dependsOn(stages, after)

	return before + stages + after

def beforePipelines(ctx):
	return changelog(ctx) + website(ctx)

def afterPipelines(ctx):
	return notify()

def changelog(ctx):
	pipelines = []
	repo_slug = ctx.build.source_repo if ctx.build.source_repo else ctx.repo.slug

	result = {
		'kind': 'pipeline',
		'type': 'docker',
		'name': 'changelog',
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
				'image': 'toolhippie/calens:latest',
				'pull': 'always',
				'commands': [
					'calens >| CHANGELOG.md',
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
				'image': 'toolhippie/calens:latest',
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
							'refs/tags/**'
						],
					},
				},
			},
			],
		'depends_on': [],
		'trigger': {
			'ref': [
				'refs/heads/master',
				'refs/pull/**',
			],
		},
	}

	pipelines.append(result)

	return pipelines

def notify():
	pipelines = []

	result = {
		'kind': 'pipeline',
		'type': 'docker',
		'name': 'chat-notifications',
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
						'from_secret': config['rocketchat']['from_secret']
					},
					'channel': config['rocketchat']['channel']
				}
			}
		],
		'depends_on': [],
		'trigger': {
			'ref': [
				'refs/tags/**'
			],
			'status': [
				'success',
				'failure'
			]
		}
	}

	for branch in config['branches']:
		result['trigger']['ref'].append('refs/heads/%s' % branch)

	pipelines.append(result)

	return pipelines

def website(ctx):
  return [
	{
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
				'	make docs-copy'
				],
			},
			{
				'name': 'test',
				'image': 'webhippie/hugo:latest',
				'commands': [
					'cd hugo',
				'	hugo',
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
		'depends_on': [],
		'trigger': {
			'ref': [
				'refs/heads/master',
				'refs/pull/**',
			],
		},
	}
  ]

def dependsOn(earlierStages, nextStages):
	for earlierStage in earlierStages:
		for nextStage in nextStages:
			nextStage['depends_on'].append(earlierStage['name'])