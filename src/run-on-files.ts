import * as core from '@actions/core'
import {execSync} from 'child_process'

export function runOnFiles(files: string[]): number {
  const phpcs = core.getInput('phpcs_path', {required: true})
  const args = ['--report=checkstyle']

  const standard = core.getInput('standard')
  if (standard) args.push(`--standard=${standard}`)

  const failOnWarning = core.getInput('fail_on_warnings')
  if (failOnWarning === 'false') {
    args.push('--runtime-set ignore_warnings_on_exit 1')
  }

  try {
    execSync(`${phpcs} ${args.join(' ')} ${files.join(' ')}`, {
      stdio: 'inherit',
      timeout: 20000
    })
    return 0
  } catch (err: any) {
    core.debug(err)
    core.setFailed(err)
    return 1
  }
}
