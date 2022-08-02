import * as React from 'react'

///Material
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import { Star, AttachMoney, AccessTime, Menu, Search, NearMeOutlined } from '@mui/icons-material';

import ApiModules from '../utils/modulesAxios'

interface CardDataSet {
    dv_cashback: string,
    dv_category: string,
    media: string,
    created: Date,
    raw_category: string,
    name: string,
    rating: number,
    price_level: number,
    dv_latlng: Array<Number>
}

const styles = {
    title: {
        fontWeight: "700",
        fontSize: "2rem",
        color: "#ba68c8"
    },
    cardsContainer: {

    }
}

const getRatePriceIcons = (times: number) => {
    const icons = []
    for (let i = 1; i <= times; i++) {
        icons.push(<Typography key={"price-icon" + "-" + i + "-of" + "-" + times}>$</Typography>)
    }
    if (icons.length < 1) {
        icons.push(<Typography key={"price-icon" + "-1-of" + "-" + times}>$</Typography>)
    }
    return icons
}

const attachMoneyButtonIconCount = (numberOfElements: number) => {
    const icons = []
    for (let i = 0; i < numberOfElements; i++) {
        icons.push(<AttachMoney />)
    }
    return icons
}

let filterParamsArray: string[] = []

const Board = () => {
    const [dataDirectory, setDataDirectory] = React.useState([])
    const [countOfPriceIcons, setCountOfPriceIcons] = React.useState(1)
    const [countTotalPages, setCountTotalPages] = React.useState(0)
    const [filtersOnUse, setFiltersOnUse] = React.useState("")
    const [paginationParams, setPaginationParams] = React.useState("")
    const [page, setPage] = React.useState(1);

    React.useState(() => {
        ApiModules.getDirectory("epp=6")
            .then(response => {
                setDataDirectory(response.data.data)
                setCountTotalPages(response.data.pages)
            })
            .catch(error => { console.error("Error:", error) })
    })

    const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        let stringParams = "p=" + value
        setPage(value);
        setPaginationParams(stringParams)
        filtersOnUse != "" ? stringParams = "&" + "p=" + value : stringParams = "epp=6&p=" + value
        updateCards(stringParams)
    };

    const updateCards = (params: string) => {
        ApiModules.getDirectory(params)
            .then(response => {
                setDataDirectory(response.data.data)
                setCountTotalPages(response.data.pages)
            })
            .catch(error => { console.error("Error:", error) })
    }

    const updateFiltersAsParams = (filterName: string) => {
        switch (filterName) {
            case "rating":
                if (filterParamsArray.length < 1 || filterParamsArray.indexOf("rating") == -1) {
                    filterParamsArray.push("rating")
                } else {
                    let indexOfElement = filterParamsArray.indexOf("rating")
                    filterParamsArray.splice(indexOfElement, 1)
                }

                // if (payloadsForFilter.length < 1 || payloadsForFilter.indexOf("&rating_payload=DESC")== -1) {
                //     payloadsForFilter.push("&rating_payload=DESC")
                // } else {
                //     let indexOfElement = payloadsForFilter.indexOf("&rating_payload=DESC")
                //     payloadsForFilter.splice(indexOfElement, 1)
                // }
                break;
            case "price":
                if (filterParamsArray.length < 1 || filterParamsArray.indexOf("price") == -1) {
                    filterParamsArray.push("price")
                }

                if (countOfPriceIcons == 3) {
                    setCountOfPriceIcons(1)
                } else {
                    setCountOfPriceIcons(countOfPriceIcons + 1)
                }

                // if (payloadsForFilter.includes("&price_payload=" + (countOfPriceIcons - 1))) {
                //     let indexOfExistingElement = payloadsForFilter.indexOf("&price_payload=" + (countOfPriceIcons - 1))
                //     if (countOfPriceIcons < 3) {
                //         payloadsForFilter.splice(indexOfExistingElement, 1)
                //         payloadsForFilter.push("&price_payload=" + countOfPriceIcons)
                //     } else {
                //         payloadsForFilter.push("&price_payload=" + 1)
                //     }
                // } else {
                //     payloadsForFilter.push("&price_payload=" + 1)
                // }
                break;
            default:
                break;
        }
        let stringWithFilters = filterParamsArray[0]
        let stringWithPayloads = ""

        if (filterParamsArray.length > 1) {
            for (let i = 1; i < filterParamsArray.length; i++) {
                stringWithFilters += "," + filterParamsArray[i]
            }
        }

        filterParamsArray.forEach(eachFilter => {
            switch (eachFilter) {
                case "rating":
                    stringWithPayloads += "&rating_payload=DESC"
                    break;
                case "price":
                    let auxCount = (countOfPriceIcons + 1) == 4 ? 1 : (countOfPriceIcons + 1)
                    stringWithPayloads += "&price_payload=" + (auxCount)
                    break;
                default:
                    break;
            }
        })

        let paramsString = "epp=6"
        if (undefined != stringWithFilters) {
            paramsString += "&filter=" + stringWithFilters
        }
        paramsString += stringWithPayloads
        setFiltersOnUse(paramsString)

        paginationParams != "" ? paramsString += paginationParams : paramsString += ""
        updateCards(paramsString)
    }



    return (
        <Grid container>
            <Grid item lg={12}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography sx={styles.title}>
                        Recompensas
                    </Typography>
             
                </Stack>
            </Grid>
            <Grid item lg={12}>
                <Stack direction="row" justifyContent="center" alignItems="center">
                    <ButtonGroup>
                        <Button onClick={() => updateFiltersAsParams("rating")}><Star /></Button>
                        <Button onClick={() => updateFiltersAsParams("price")}>{attachMoneyButtonIconCount(countOfPriceIcons)}</Button>
                        <Button><Menu /></Button>
                    </ButtonGroup>
                </Stack>
            </Grid>
            <Grid item lg={12}>
                <Grid container justifyContent="center" alignContent="center">
                    <Grid item lg={10} md={10} sm={11} xs={11}>
                        <Grid container>
                            {dataDirectory.map((eachDataSet: CardDataSet) => (
                                <Grid item lg={4} md={4} sm={12} xs={12} sx={{ padding: "8px" }} key={eachDataSet.name.replace(" ", "-") + "-" + eachDataSet.created}>
                                    <Paper elevation={3}  >
                                        <Stack>
                                            <Stack direction="row" justifyContent="space-between" alignItems="self-end">
                                                <Box sx={{ width: "20%", height: "100px" }}>
                                                    <img width={"100%"} height={"100%"} src={eachDataSet.media} alt="logo" />
                                                </Box>
                                                <Box sx={{ border: "1px solid", backgroundColor: "#2e58ff", height: "10%", borderRadius: "20px", padding: "1%" }}>
                                                    <Typography sx={{ color: "#FFFFFF", fontSize: "0.8rem" }}>{eachDataSet.dv_cashback} CASHBACK</Typography>
                                                </Box>
                                            </Stack>

                                            <Grid container>
                                                <Grid item xs={9}>
                                                    <Typography sx={{ fontWeight: "600" }}>{eachDataSet.name}</Typography>
                                                    <Typography>{eachDataSet.dv_category}</Typography>

                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Stack direction="row">
                                                        {getRatePriceIcons(eachDataSet.price_level)}
                                                        <Typography>•</Typography>
                                                        <Star sx={{ color: "rgb(255, 215, 0)" }} />
                                                        <Typography> {eachDataSet.rating}</Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>

                                            <Box>
                                                <Divider />
                                                <Link href={"https://www.google.com/maps/search/?api=1&query=" + eachDataSet.dv_latlng[1] + "," + eachDataSet.dv_latlng[0]}><NearMeOutlined />Locacion</Link>

                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
            <Grid item lg={12}>
                <Grid container justifyContent="center" alignContent="center">
                    <Pagination count={countTotalPages} page={page} onChange={handleChangePagination} />
                </Grid>
            </Grid>
        </ Grid>
    )
}

export default Board