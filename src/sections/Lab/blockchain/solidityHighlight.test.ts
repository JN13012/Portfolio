import { describe, expect, it } from 'vitest'
import { highlightLine } from './solidityHighlight'

const kinds = (line: string) => highlightLine(line).filter(token => token.kind).map(token => `${token.kind}:${token.text}`)

describe('highlightLine', () => {
  it('keeps the text intact', () => {
    const line = '        (bool sent,) = msg.sender.call{value: amount}(""); // pays'
    expect(highlightLine(line).map(token => token.text).join('')).toBe(line)
  })

  it('colors keywords, types, functions, strings and comments', () => {
    expect(kinds('function withdraw() external override {')).toEqual(['keyword:function', 'function:withdraw', 'keyword:external', 'keyword:override'])
    expect(kinds('if (amount == 0) revert NothingToWithdraw();')).toEqual(['control:if', 'number:0', 'control:revert', 'type:NothingToWithdraw'])
    expect(kinds('mapping(address account => uint256 amount) public balanceOf;')).toEqual(['keyword:mapping', 'type:address', 'type:uint256', 'keyword:public'])
    expect(kinds('/// @notice Sends it back.')).toEqual(['comment:/// ', 'tag:@notice', 'comment: Sends it back.'])
  })
})
