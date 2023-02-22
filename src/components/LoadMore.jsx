/** @jsx jsx */
import { jsx, Button, Box } from 'theme-ui'
import React, { useState } from 'react'
import Reply from './Reply'
import Comment from './Comment'
import { loadMoreComments } from '../utils/getComments'

const LoadMore = ({ comment, child, permalink, depth, isTopLevel }) => {
  const [replies, setReplies] = useState([])

  const newDepth = depth && !isTopLevel ? depth : comment.data.depth

  return (
    <>
      {replies.length === 0 ? (
        <Button
          sx={{
            all: 'unset',
            cursor: 'pointer',
            color: '#4aabe7',
            fontSize: '11px',
            ml: (depth ? depth : comment.data.depth) === 0 ? '14px' : 0,
            my: '4px',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
          onClick={() =>
            loadMoreComments(child.data.children, permalink).then((res) =>
              setReplies(res)
            )
          }
        >
          Load More ({child.data.count})
        </Button>
      ) : (
        <>
          {replies.map((children, i) => (
            <Box key={i}>
              {children !== undefined && (
                <>
                  {children.map((child) => (
                    <Box key={child.data.id}>
                      {isTopLevel ? (
                        <Comment comment={child} permalink={permalink} />
                      ) : (
                        <Reply
                          child={child}
                          permalink={permalink}
                          depth={comment.data.depth + (child.data.depth + 1)}
                          isLoadMore
                        />
                      )}
                    </Box>
                  ))}
                </>
              )}
            </Box>
          ))}
        </>
      )}
    </>
  )
}

export default LoadMore
