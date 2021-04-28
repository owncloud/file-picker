import { render, waitFor, fireEvent } from '@testing-library/vue'
import '@testing-library/jest-dom'
import { testResources } from '../../helpers/mocks'
import FilePicker from '@/components/FilePicker.vue'

describe('Users can select location from within the file picker', () => {
  test('User can select the current folder', async () => {
    const { getByTestId, emitted } = render(FilePicker, {
      props: {
        variation: 'location'
      }
    })

    await waitFor(() => expect(getByTestId('list-resources-table')).toBeVisible())
    expect(getByTestId('list-header-btn-select')).toBeVisible()
    await fireEvent.click(getByTestId('list-header-btn-select'))

    const rootFolder = testResources[0]

    expect(emitted().selectResources[0][0].id).toMatch(
      rootFolder.fileInfo['{http://owncloud.org/ns}fileid']
    )
  })
})
