import * as core from '@actions/core'
import * as github from '@actions/github'
import {createInterface} from 'readline'
import {existsSync} from 'fs'
import picomatch from 'picomatch'
import {spawn} from 'child_process'

interface ChangedFiles {
  files: string[]
}

export async function getChangedFiles(): Promise<ChangedFiles> {
  const pattern = core.getInput('files', {
    required: false
  })

  const globs = pattern.length ? pattern.split(',') : ['**.php']
  const isMatch = picomatch(globs)
  console.log('Filter patterns:', globs, isMatch('src/test.php'))
  const payload = github.context

  try {
    const git = spawn(
      'git',
      [
        '--no-pager',
        'diff-tree',
        '--no-commit-id',
        '--name-status',
        '--diff-filter=d',
        '-r',
        `${payload.sha}..`
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
      const parsed = /^(?<status>[ACMR])[\s\t]+(?<file>\S+)$/.exec(line)
      if (parsed?.groups) {
        const file = parsed.groups[1]

        if (isMatch(file) && existsSync(file)) {
          result.files.push(file)
        }
      }
    }
    return result
  } catch (err) {
    console.error(err)
    return {
      files: []
    }
  }
}
