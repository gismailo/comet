/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { jsx, Flex, Link, Text } from 'theme-ui'
import convertDate from '../utils/convertDate'
import formatNumber from '../utils/formatNumber'
import VoteButton from './VoteButton'
import { getVote, getScore } from '../utils/voteUtils'

const CommentHeader = ({ comment }) => {
  const [vote, setVote] = useState(0)
  const [score, setScore] = useState(comment.data.score)

  useEffect(() => {
    setVote(getVote(comment.data.likes))
  }, [comment.data.likes])

  const handleVote = (voteType) => {
    setScore(getScore(vote, voteType, score))
    const direction = vote === voteType ? 0 : voteType
    setVote(direction)
    chrome.runtime.sendMessage({ voteId: comment.data.name, direction })
  }

  return (
    <Flex
      sx={{
        gap: '12px',
        fontSize: '13px',
        color: 'secondaryText',
        flexWrap: 'wrap',
      }}
    >
      <Flex
        sx={{
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <VoteButton
          vote={vote}
          voteType={1}
          handleClick={handleVote}
          size="14px"
        />
        <Text
          sx={{
            fontWeight: '500',
            color:
              vote === 1 ? 'primary' : vote === -1 ? 'purple' : 'secondaryText',
          }}
        >
          {formatNumber(score)}
        </Text>
        <VoteButton
          vote={vote}
          voteType={-1}
          handleClick={handleVote}
          size="14px"
        />
      </Flex>
      <Link
        sx={{
          color: 'primary',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
        href={`https://reddit.com/u/${comment.data.author}`}
        target="_blank"
        rel="noreferrer"
      >
        {comment.data.author}
      </Link>
      <Text sx={{ whiteSpace: 'noWrap' }}>
        {convertDate(comment.data.created_utc)}
      </Text>
    </Flex>
  )
}

export default CommentHeader
