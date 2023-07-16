/** @jsx jsx */
import { jsx, Link } from 'theme-ui'
import PostMessageWrap from './PostMessageWrap'

const NoPosts = ({ url, isContent }) => {
  return (
    <PostMessageWrap isContent={isContent}>
      No posts found.{' '}
      <Link
        sx={{
          color: 'primary',
          textDecoration: 'none',
          ml: '4px',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
        href={`https://www.reddit.com/r/voatme/submit?url=${url}`}
        rel="noreferrer"
        target="_blank"
      >
        Submit it
      </Link>
    </PostMessageWrap>
  )
}

export default NoPosts
