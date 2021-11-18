import * as core from '@actions/core'
import * as github from '@actions/github'
import {createInterface} from 'readline'
import {existsSync} from 'fs'
import picomatch from 'picomatch'
import {spawn} from 'child_process'

interface ChangedFiles {
  files: string[]
}

export async function getAllFiles(): Promise<ChangedFiles> {
  const pattern = core.getInput('files', {
    required: false
  })

  const globs = pattern.length ? pattern.split(',') : ['**.php']
  const isMatch = picomatch(globs)
  console.log('Filter patterns:', globs)
  const payload = github.context

  try {
    console.log(payload.sha)
    const git = spawn(
      'git',
      [
        '--no-pager',
        'ls-tree',
        '--full-tree',
        '--name-only',
        '-r',
        payload.sha
      ],
      {
        windowsHide: true,
        timeout: 5000
      }
    )

    const readline = createInterface({
      input: git.stdout
    })
    const result: ChangedFiles = {
      files: []
    }
    for await (const line of readline) {
      if (isMatch(line) && existsSync(line)) {
        result.files.push(line)
      } else {
        console.log('Skip:', line)
      }
    }
    return result
  } catch (err) {
    console.log('Error')
    console.error(err)
    return {
      files: []
    }
  }
}
