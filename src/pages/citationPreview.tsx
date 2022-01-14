import * as React from "react"
import { Box, Container, Typography } from "@mui/material"
import Seo from "../components/Seo"
import Layout from "../components/pages/Layout"
import CitationEditor from "../components/editor/CitationEditor"

const CitationPreviewPage: React.FC = () => {
  return (
    <Layout>
      {/* TODO:: add more info */}
      <Seo title="Home" />
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 6,
        }}
      >
        <Container>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Citation Preview
          </Typography>
          <CitationEditor />
        </Container>
      </Box>
    </Layout>
  )
}

export default CitationPreviewPage
