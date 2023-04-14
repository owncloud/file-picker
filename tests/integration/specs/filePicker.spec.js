import { render, fireEvent, screen } from '@testing-library/vue'
import '@testing-library/jest-dom'

import resources from '../../fixtures/resources'

import { listResources } from '~/tests/helpers/mocks'

import FilePicker from '~/src/components/FilePicker.vue'

const SELECTORS = Object.freeze({
  listResources: 'list-resources',
  listRow: (id) => `list-resources-row-${id}`,
  btnSelect: 'list-header-btn-select',
  listRowCheckbox: (id) => `list-resources-checkbox-${id}`,
  btnReturn: 'btn-return'
})

const renderPage = ({ props } = {}) =>
  render(FilePicker, {
    props: { variation: 'location', ...props },
    provide: {
      client: { value: {} },
      webdav: {
        value: {
          listFiles: listResources
        }
      },
      sdk: { value: {} },
      config: { value: {} },
      capabilities: { value: { capabilities: {} } },
      user: { value: {} }
    }
  })

describe('Users can select location from within the file picker', () => {
  test('User can select the current folder', async () => {
    const { emitted } = renderPage()

    expect(await screen.findByTestId(SELECTORS.listResources)).toBeVisible()
    expect(screen.getByTestId(SELECTORS.btnSelect)).toBeVisible()
    await fireEvent.click(screen.getByTestId(SELECTORS.btnSelect))

    expect(emitted().select[0][0][0].id).toBe(resources['/'][0].id)
  })

  test('User can select a nested folder as a location', async () => {
    const { emitted } = renderPage()

    expect(await screen.findByTestId(SELECTORS.listResources)).toBeVisible()

    expect(screen.getByText('Documents')).toBeVisible()

    await fireEvent.click(screen.getByText('Documents'))

    expect(await screen.findByText('Invoices')).toBeVisible()
    expect(screen.getByText('readme')).toBeVisible()
    expect(screen.getByTestId(SELECTORS.listRow(resources['/Documents'][2].id))).toHaveClass(
      'files-list-row-disabled'
    )

    await fireEvent.click(screen.getByTestId(SELECTORS.listRow(resources['/Documents'][1].id)))

    expect(screen.getByTestId(SELECTORS.listRow(resources['/Documents'][1].id))).toHaveClass(
      'oc-background-selected'
    )

    await fireEvent.click(screen.getByTestId(SELECTORS.btnSelect))

    expect(emitted().select[0][0][0].id).toBe(resources['/Documents/Invoices'][0].id)
  })

  test('Developers can get location from update event when folder is loaded', async () => {
    const { emitted } = renderPage()

    expect(await screen.findByTestId(SELECTORS.listResources)).toBeVisible()

    expect(emitted().update[emitted().update.length - 1][0][0].id).toEqual('root')

    await fireEvent.click(screen.getByText('Documents'))

    expect(await screen.findByText('readme')).toBeVisible()

    expect(emitted().update[emitted().update.length - 1][0][0].id).toEqual('documents')
  })

  test('Developers can get current loaded folder from "folderLoaded" event after the load is finished', async () => {
    const { emitted } = renderPage()

    expect(await screen.findByTestId(SELECTORS.listResources)).toBeVisible()

    expect(emitted().folderLoaded[0][0].id).toEqual('root')

    await fireEvent.click(screen.getByText('Documents'))

    expect(await screen.findByText('readme')).toBeVisible()
    expect(emitted().folderLoaded[1][0].id).toEqual('documents')
  })
})

describe('Users can select resources from within the file picker', () => {
  test('User can select resources from the current folder', async () => {
    const { emitted } = renderPage({
      props: {
        variation: 'resource'
      }
    })

    expect(await screen.findByTestId(SELECTORS.listResources)).toBeVisible()
    expect(screen.getByText('Documents')).toBeVisible()

    await fireEvent.click(screen.getByText('Documents'))

    expect(await screen.findByText('Invoices')).toBeVisible()
    expect(screen.getByText('readme')).toBeVisible()
    expect(screen.getByTestId('list-resources-row-readme')).not.toHaveClass(
      'files-list-row-disabled'
    )

    await fireEvent.click(
      screen.getByTestId(SELECTORS.listRowCheckbox('invoices')).querySelector('.oc-checkbox')
    )
    await fireEvent.click(
      screen.getByTestId(SELECTORS.listRowCheckbox('readme')).querySelector('.oc-checkbox')
    )

    expect(screen.getByTestId(SELECTORS.listRow('invoices'))).toHaveClass('oc-background-selected')
    expect(screen.getByTestId(SELECTORS.listRow('readme'))).toHaveClass('oc-background-selected')
    expect(screen.getByTestId(SELECTORS.btnSelect)).toBeVisible()

    await fireEvent.click(screen.getByTestId(SELECTORS.btnSelect))

    expect(emitted().select[0][0][0].id).toBe('invoices')
    expect(emitted().select[0][0][1].id).toBe('readme')
  })

  test('Developers can listen to event each time a resource is selected', async () => {
    const { emitted } = renderPage({
      props: {
        variation: 'resource'
      }
    })

    expect(await screen.findByTestId(SELECTORS.listResources)).toBeVisible()

    expect(screen.getByTestId(SELECTORS.listRowCheckbox('documents'))).toBeVisible()
    expect(screen.getByTestId(SELECTORS.listRowCheckbox('teotihuacan'))).toBeVisible()

    await fireEvent.click(
      screen.getByTestId(SELECTORS.listRowCheckbox('documents')).querySelector('.oc-checkbox')
    )
    await fireEvent.click(
      screen.getByTestId(SELECTORS.listRowCheckbox('teotihuacan')).querySelector('.oc-checkbox')
    )

    expect(emitted().update[0][0].length).toBe(2)
    expect(emitted().update[0][0][0].id).toBe('documents')
    expect(emitted().update[0][0][1].id).toBe('teotihuacan')

    await fireEvent.click(
      screen.getByTestId(SELECTORS.listRowCheckbox('teotihuacan')).querySelector('.oc-checkbox')
    )

    expect(emitted().update[0][0].length).toBe(1)
  })

  test('Go back button is focused after folder has been loaded', async () => {
    renderPage({
      props: {
        variation: 'resource',
        isInitialFocusEnabled: true
      }
    })

    expect(await screen.findByTestId(SELECTORS.listResources)).toBeVisible()
    await fireEvent.click(screen.getByText('Documents'))

    expect(screen.getByTestId(SELECTORS.btnReturn)).toBe(document.activeElement)
  })
})
