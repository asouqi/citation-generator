import * as React from "react"
import { useCallback, useState } from "react"
import { Box, CardContent, Container, Tab, Tabs, Typography } from "@mui/material"

import Layout from "./Layout"
import Seo from "../Seo"
import TabPanel from "../TabPanel"
import CitationForm from "../CitationForm"
import { StoreProvider } from "../../provider/Store"
import { CitationDocumentType, CitationStyle } from "../../types"
import { DBProvider } from "../../provider/DBProvider"
import { ToggleCitationsListButton } from "../Buttons"
import { ReferencesList } from "../ReferencesList"

interface PageProps {
  pageContext: { id: string; title: string; style: CitationStyle }
}

const Generator: React.FC<PageProps> = ({ pageContext }) => {
  const [documentType, setDocumentType] = useState<CitationDocumentType>(
    CitationDocumentType.JOURNAL,
  )
  const onDocumentTypeClick = useCallback((event, type) => setDocumentType(type), [])
  return (
    <DBProvider format={pageContext.style} citationDocument={documentType}>
      <Layout>
        {/* TODO:: add more info */}
        <Seo title={`${pageContext.title}`} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            p: 1,
            m: 1,
          }}
        >
          <Container>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                component="h1"
                variant="h5"
                align="center"
                color="text.primary"
                gutterBottom
                sx={{ p: 1 }}
              >
                {pageContext.title}
              </Typography>

              <ToggleCitationsListButton />

              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={documentType} onChange={onDocumentTypeClick} centered>
                  <Tab value={CitationDocumentType.JOURNAL} label="Journal" />
                  <Tab value={CitationDocumentType.BOOK} label="Book" />
                  <Tab value={CitationDocumentType.REPORT} label="Report" />
                  <Tab value={CitationDocumentType.WEBSITE} label="Website" />
                </Tabs>
              </Box>
            </CardContent>

            <StoreProvider>
              {(
                Object.keys(CitationDocumentType) as Array<
                  keyof typeof CitationDocumentType
                >
              ).map((document) => (
                <TabPanel
                  key={document}
                  value={CitationDocumentType[document]}
                  index={documentType}
                >
                  <CitationForm type={CitationDocumentType[document]} />
                </TabPanel>
              ))}
            </StoreProvider>
          </Container>

          <ReferencesList />
        </Box>
      </Layout>
    </DBProvider>
  )
}

export default Generator
