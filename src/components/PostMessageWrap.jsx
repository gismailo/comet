/** @jsx jsx */
import { jsx, Box, Flex } from 'theme-ui'
import YoutubeToggle from './YoutubeToggle'

const PostMessageWrap = ({ isContent, children }) => {
  return (
    <Flex
      sx={{
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box />
      <Flex>{children}</Flex>
      <Box>
        <YoutubeToggle isContent={isContent} />
      </Box>
    </Flex>
  )
}

export default PostMessageWrap
