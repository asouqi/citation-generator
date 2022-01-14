import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import {
  Box,
  Checkbox,
  Container,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material"

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import styled from "styled-components"
import { generateCitation, generateCitations } from "./utilities/citation_generator"
import { DBContext } from "../provider/DBProvider"
import { CitationDocumentType, CitationJSDocumentType } from "../types"
import { ReferenceExportButton, ReferenceFilterButton } from "./Buttons"
import { ReferencesListContext } from "../provider/ReferencesListProvider"
import { grey } from "@mui/material/colors"
import { navigate } from "gatsby"

export const ReferencesList: React.FC = () => {
  const { state, showCitationsList, dispatch } = useContext(DBContext)
  const { filters, selectedCitations, setSelectedCitations } =
    useContext(ReferencesListContext)

  const citations = useMemo(() => {
    const citations: {
      view: { convertedCitation: string; inText: string }
      citationID: string
    }[] = []
    filters.map((doc) =>
      Object.values(state.value[doc]).map((c) => {
        citations.push({
          view: generateCitation(c, CitationJSDocumentType[doc], "html"),
          citationID: c.id,
        })
      }),
    )
    return citations
  }, [state.value, filters])

  const handleOnDeleteClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (event.currentTarget) {
        dispatch({
          type: "delete",
          citationDocument: CitationDocumentType.JOURNAL,
          citationID: (event.currentTarget as HTMLButtonElement).value,
        })
      }
    },
    [dispatch],
  )

  const handleOnEditClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (event.currentTarget) {
        dispatch({
          type: "edit",
          citationDocument: CitationDocumentType.JOURNAL,
          citationID: (event.currentTarget as HTMLButtonElement).value,
        })
      }
    },
    [dispatch],
  )

  const [toggleInTextCitation, setToggleInTextCitation] = useState(false)
  const onToggleInTextCitationClick = useCallback(
    () => setToggleInTextCitation(!toggleInTextCitation),
    [toggleInTextCitation, setToggleInTextCitation],
  )

  const onCheckBoxClick = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value
      if (selectedCitations.includes(value)) {
        setSelectedCitations([...selectedCitations.filter((c) => c != value)])
      } else {
        setSelectedCitations([...selectedCitations, value])
      }
    },
    [selectedCitations, setSelectedCitations],
  )

  if (!showCitationsList) {
    return <></>
  }

  return (
    <Container
      sx={{
        width: "25%",
        p: 4,
        m: 0,
        textAlign: "center",
        border: "1px solid rgba(0, 0, 0, 0.12);",
        borderRadius: "10px",
      }}
    >
      <List dense subheader={<ListHeader />}>
        {citations.map((citation, index) => {
          const labelId = `checkbox-list-secondary-label-${index}`

          return (
            <RefListItem
              id={labelId}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
              key={index.toString()}
              secondaryAction={
                <Stack direction="row">
                  <Checkbox
                    edge="end"
                    inputProps={{ "aria-labelledby": labelId }}
                    value={citation.citationID}
                    onChange={onCheckBoxClick}
                    checked={selectedCitations.includes(citation.citationID)}
                  />
                </Stack>
              }
              disablePadding
            >
              <Stack direction="row" alignItems="center">
                <Stack className="edit-button-group" direction="column">
                  <IconButton
                    onClick={handleOnEditClick}
                    value={citation.citationID}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleOnDeleteClick}
                    value={citation.citationID}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>

                <Stack width="80%">
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: citation?.view.convertedCitation || "",
                    }}
                  />

                  <Box
                    className="in-text-view"
                    style={{ padding: "2px" }}
                    display="flex"
                    flexDirection="column"
                  >
                    <Stack direction="row" alignItems="center">
                      <Typography
                        variant="caption"
                        display="block"
                        gutterBottom
                        margin={0}
                      >
                        In-text Citation
                      </Typography>
                      <IconButton
                        sx={{ padding: 0 }}
                        onClick={onToggleInTextCitationClick}
                      >
                        {(toggleInTextCitation && <ArrowDropUpIcon />) || (
                          <ArrowDropDownIcon />
                        )}
                      </IconButton>
                    </Stack>

                    {toggleInTextCitation && (
                      <Box
                        dangerouslySetInnerHTML={{
                          __html: citation?.view.inText || "",
                        }}
                      />
                    )}
                  </Box>
                </Stack>
              </Stack>
            </RefListItem>
          )
        })}
      </List>
    </Container>
  )
}

const ListHeader: React.FC = () => {
  const [selectAll, setSelectedAll] = useState(false)
  const { setSelectedCitations, selectedCitations, filters } =
    useContext(ReferencesListContext)
  const { state } = useContext(DBContext)

  const onSelectAllClick = useCallback(() => {
    if (!selectAll) {
      const selectedCitations: string[] = []
      filters.map((doc) =>
        Object.values(state.value[doc]).map((c) => selectedCitations.push(c.id)),
      )
      setSelectedCitations(selectedCitations)
    } else {
      setSelectedCitations([])
    }
    setSelectedAll(!selectAll)
  }, [setSelectedAll, selectAll, filters, setSelectedCitations, state.value])

  const onPreviewClick = useCallback(() => {
    // TODO:: Abstract to utils method
    let citations = ""
    filters.map((doc) => {
      const citation = Object.values(state.value[doc])
        .filter((c) => selectedCitations.includes(c.id) && c)
        .map((c) => ({ ...c }))
      citations = citations.concat(generateCitations(citation) + "\n")
    })
    return navigate("/citationPreview", { state: { htmlCitations: citations } })
  }, [filters, state.value, selectedCitations])

  return (
    <Box>
      <Typography>References</Typography>
      <Stack
        justifyContent="space-between"
        direction="row"
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.12);",
          borderRadius: "10px",
          margin: "12px 0",
          background: grey[300],
        }}
      >
        <Box>
          <ReferenceFilterButton />
          <IconButton onClick={onPreviewClick}>
            <RemoveRedEyeIcon />
          </IconButton>
        </Box>
        <Box marginRight="18px">
          <ReferenceExportButton />
          <Checkbox edge="end" value={selectAll} onChange={onSelectAllClick} />
        </Box>
      </Stack>
    </Box>
  )
}

const RefListItem = styled(ListItem)`
  .in-text-view {
    max-height: 0;
    max-width: 0;
    transition: max-height 0.15s ease-in, max-width 0.15s ease-out;
    overflow: hidden;
  }
  .edit-button-group {
    max-height: 0;
    max-width: 0;
    transition: max-height 0.15s ease-out, max-width 0.15s ease-out;
    overflow: hidden;
  }

  :hover {
    .in-text-view {
      max-height: fit-content;
      max-width: fit-content;
      transition: max-height 0.5s ease-in, max-width 0.5s ease-in;
    }
    .edit-button-group {
      max-height: fit-content;
      max-width: fit-content;
      transition: max-height 0.5s ease-in, max-width 0.5s ease-in;
    }

    background: #dcdcdc;
    border-radius: 10px;
  }

  .csl-bib-body {
    padding: 4px;
  }
`
