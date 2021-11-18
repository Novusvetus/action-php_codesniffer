import * as core from '@actions/core'
import * as path from 'path'
import {getAllFiles} from './get-all-files'
import {getChangedFiles} from './get-changed-files'
import {runOnFiles} from './run-on-files'

async function run(): Promise<void> {
  try {
    const scan_all = core.getBooleanInput('scan_all', {
      required: false
    })

    let files
    if (scan_all) {
      files = await getAllFiles()
    } else {
      files = await getChangedFiles()
    }
    core.info(JSON.stringify(files, null, 2))
    if (!files.files.length) {
      return
    }

    const matchersPath = path.join(__dirname, '..', '.github')
    console.log(`##[add-matcher]${path.join(matchersPath, 'matcher.json')}`)

    runOnFiles(files.files)
  } catch (error: any) {
    core.setFailed(error.message)
  }
}

run()
