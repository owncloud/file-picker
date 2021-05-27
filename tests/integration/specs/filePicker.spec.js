import { render, waitFor, fireEvent } from '@testing-library/vue'
import '@testing-library/jest-dom'
import resources from '../../fixtures/resources'
import FilePicker from '@/components/FilePicker.vue'

describe('Users can select location from within the file picker', () => {
  test('User can select the current folder', async () => {
    const { getByTestId, emitted } = render(FilePicker, {
      props: {
        variation: 'location',
      },
    })

    await waitFor(() => expect(getByTestId('list-resources-table')).toBeVisible())
    expect(getByTestId('list-header-btn-select')).toBeVisible()
    await fireEvent.click(getByTestId('list-header-btn-select'))

    const rootFolder = resources['/'][0]

    expect(emitted().select[0][0][0].id).toMatch(
      rootFolder.fileInfo['{http://owncloud.org/ns}fileid']
    )
  })

  test('User can select a nested folder as a location', async () => {
    const { getByTestId, emitted, getByText } = render(FilePicker, {
      props: {
        variation: 'location',
      },
    })

    await waitFor(() => expect(getByTestId('list-resources-table')).toBeVisible())

    expect(getByText('Photos')).toBeVisible()

    await fireEvent.click(getByText('Photos'))

    await waitFor(() => expect(getByText('Vacation')).toBeVisible())
    expect(getByText('Teotihuacan')).toBeVisible()
    expect(getByTestId('list-resources-row-9')).toHaveClass('files-list-row-disabled')

    await fireEvent.click(getByTestId('list-resources-row-1'))

    expect(getByTestId('list-resources-row-1')).toHaveClass('oc-background-selected')
    expect(getByTestId('list-header-btn-select')).toBeVisible()

    await fireEvent.click(getByTestId('list-header-btn-select'))

    const expectedFolder = resources['/Photos'].find(
      (r) => r.fileInfo['{http://owncloud.org/ns}fileid'] === '1'
    )

    expect(emitted().select[0][0][0].id).toMatch(
      expectedFolder.fileInfo['{http://owncloud.org/ns}fileid']
    )
  })
})

describe('Users can select resources from within the file picker', () => {
  test('User can select resources from the current folder', async () => {
    const { getByTestId, getByText, emitted } = render(FilePicker, {
      props: {
        variation: 'resource',
      },
    })

    await waitFor(() => expect(getByTestId('list-resources-table')).toBeVisible())

    expect(getByText('Photos')).toBeVisible()

    await fireEvent.click(getByText('Photos'))

    await waitFor(() => expect(getByText('Vacation')).toBeVisible())
    expect(getByText('Teotihuacan')).toBeVisible()
    expect(getByTestId('list-resources-row-9')).not.toHaveClass('files-list-row-disabled')

    await fireEvent.click(getByTestId('list-resources-checkbox-1').querySelector('.oc-checkbox'))
    await fireEvent.click(getByTestId('list-resources-checkbox-9').querySelector('.oc-checkbox'))

    expect(getByTestId('list-resources-row-1')).toHaveClass('oc-background-selected')
    expect(getByTestId('list-resources-row-9')).toHaveClass('oc-background-selected')
    expect(getByTestId('list-header-btn-select')).toBeVisible()

    await fireEvent.click(getByTestId('list-header-btn-select'))

    const expectedResources = resources['/Photos']

    expect(
      expectedResources.find(
        (r) => r.fileInfo['{http://owncloud.org/ns}fileid'] === emitted().select[0][0][0].id
      )
    ).toBeTruthy()
    expect(
      expectedResources.find(
        (r) => r.fileInfo['{http://owncloud.org/ns}fileid'] === emitted().select[0][0][1].id
      )
    ).toBeTruthy()
  })

  test('Developers can listen to event each time a resource is selected', async () => {
    const { getByTestId, emitted } = render(FilePicker, {
      props: {
        variation: 'resource',
      },
    })

    await waitFor(() => expect(getByTestId('list-resources-table')).toBeVisible())

    expect(getByTestId('list-resources-checkbox-144228')).toBeVisible()
    expect(getByTestId('list-resources-checkbox-144242')).toBeVisible()

    await fireEvent.click(
      getByTestId('list-resources-checkbox-144228').querySelector('.oc-checkbox')
    )
    await fireEvent.click(
      getByTestId('list-resources-checkbox-144242').querySelector('.oc-checkbox')
    )

    expect(emitted().update[0][0].length).toBe(2)
    expect(emitted().update[0][0][0].id).toMatch('144228')
    expect(emitted().update[0][0][1].id).toMatch('144242')

    await fireEvent.click(
      getByTestId('list-resources-checkbox-144242').querySelector('.oc-checkbox')
    )

    expect(emitted().update[0][0].length).toBe(1)
  })
})
