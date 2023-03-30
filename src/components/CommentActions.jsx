import React, { useState } from 'react'
import { Button, Flex, Textarea, Text } from 'theme-ui'

const CommentActions = ({
  permalink,
  commentId,
  commentName,
  isSaved,
  setNewReply,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [saved, setSaved] = useState(isSaved)

  const handleSave = () => {
    const action = saved ? 'unsave' : 'save'
    chrome.runtime.sendMessage({ saveId: commentName, action }, (response) => {
      if (response.error) {
        console.error(response.error)
      } else {
        setSaved(!saved)
      }
    })
  }

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm)
  }

  const handleSubmitReply = (e) => {
    e.preventDefault()

    chrome.runtime.sendMessage(
      {
        replyId: commentName,
        replyText: e.target.reply.value,
      },
      (response) => {
        if (response.json.errors.length > 0) {
          setErrorMessage(response.json.errors[0][1])
        } else {
          setShowReplyForm(false)
          setNewReply(response.json.data.things[0])
        }
      }
    )
  }

  return (
    <>
      <Flex sx={{ gap: '12px', mt: '6px' }}>
        <Button
          onClick={() =>
            window.open(`https://reddit.com${permalink}${commentId}`)
          }
          variant="action"
        >
          permanlink
        </Button>
        <Button onClick={handleSave} variant="action">
          {saved ? 'unsave' : 'save'}
        </Button>
        <Button onClick={toggleReplyForm} variant="action">
          {showReplyForm ? 'cancel' : 'reply'}
        </Button>
      </Flex>
      {showReplyForm && (
        <form onSubmit={handleSubmitReply}>
          <Textarea
            name="reply"
            sx={{
              border: '1px solid #d1d1d1',
              height: '120px',
              backgroundColor: '#fff',
              mt: '12px',
              outline: 'none',
              font: 'inherit',
              fontSize: '14px',
              resize: 'vertical',
              transition: 'all .15s ease-in-out',
              '&:hover': {
                borderColor: '#4aabe7',
              },
              '&:focus': {
                borderColor: '#4aabe7',
              },
            }}
          />
          <Flex sx={{ gap: '6px', alignItems: 'center' }}>
            <Button
              type="submit"
              sx={{
                all: 'unset',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '13px',
                color: '#6a6a6a',
                p: '4px 8px',
                mt: '8px',
                borderRadius: '3px',
                border: '1px solid #d1d1d1',
                transition: 'all .15s ease-in-out',
                background: '#e6e6e6',
                '&:hover': {
                  backgroundColor: '#d1d1d1',
                },
              }}
            >
              Reply
            </Button>
            {errorMessage && (
              <Text
                sx={{
                  color: 'red',
                  fontSize: '13px',
                  display: 'block',
                  mt: '6px',
                }}
              >
                {errorMessage}
              </Text>
            )}
          </Flex>
        </form>
      )}
    </>
  )
}

export default CommentActions
