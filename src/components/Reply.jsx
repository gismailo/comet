/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
import Comment from './Comment'

const Reply = ({ child, permalink, depth, isLoadMore = false }) => {
  const newDepth = depth ? depth : child.data.depth
  return (
    <Box
      sx={{
        background: newDepth % 2 === 0 ? '#fff' : '#f8f8f8',
        m: newDepth === 1 ? '6px 0 8px 14px' : '0 0 8px 0',
        border: '1px solid #d1d1d1',
        borderRadius: '3px',
      }}
    >
      <Comment
        comment={child}
        permalink={permalink}
        depth={isLoadMore ? depth + 1 : depth}
        isLoadMore={isLoadMore}
      />
    </Box>
  )
}

export default Reply
