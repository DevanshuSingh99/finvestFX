import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import DataTable from "react-data-table-component";
import { createTheme } from "react-data-table-component";

createTheme(
    "solarized",
    {
        text: {
            primary: `rgb(238, 238, 238)`,
            secondary: `rgb(31, 142, 241)`,
        },
        background: {
            default: `rgb(39, 41, 61)`,
        },
        divider: {
            default: `rgb(64, 132, 243)`,
        },
        button: {
            hover: "rgba(0,0,0,.08)",
            focus: "rgba(255, 255, 255, 0.12)",
            disabled: "rgba(255, 255, 255, 0.34)",
        },
        sortFocus: {
            default: "rgb(42, 161, 152)",
        },
    },
    "dark"
);

function Table() {
    const [data, setData] = useState();
    const [filters, setFilters] = useState({ category: undefined });
    const [categories, setCategoies] = useState();
    useEffect(() => {
        var data = localStorage.getItem("data");
        if (data !== "undefined" && data !== null) {
            // if (0) {
            console.log(JSON.parse(data));
            setData(JSON.parse(data));
            const unique = [...new Set(JSON.parse(data).map((item) => item.group))];
            setCategoies(unique);
        } else {
            console.log("e");
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        await axios({
            method: "get",
            url: "http://localhost:3000/getData",
        })
            .then((res) => {
                setData(res.data);
                const unique = [...new Set(res.data.map((item) => item.group))];
                setCategoies(unique);
            })
            .catch((errRes) => {
                console.log(errRes);
            });
    };

    const getFilteredLog = (data) => {
        let value = [...data];
        let filteredTableValue = value;
        Object.keys(filters).map((key) => {
            if (filters[key]) {
                let toPop = [];
                if (filters[key] !== "All") {
                    value.map((log) => {
                        if (log[key] !== filters[key]) {
                            let index = value.indexOf(log);
                            toPop.push(index);
                        }
                    });
                    toPop.reverse();
                    toPop.map((item) => {
                        filteredTableValue.splice(item, 1);
                    });
                }
            }
        });
        return getTable(filteredTableValue);
    };
    function getTable(tableData) {
        console.log(tableData);
        const columns = [
            {
                name: "ID",
                selector: (row) => row.id,
                sortable: true,
            },
            {
                name: "Name",
                selector: (row) => row.name,
            },
            {
                name: "Image",

                cell: (row, index, column, id) => {
                    return <img src={row.image} width={70} />;
                },
            },
            {
                name: "Category",
                selector: (row) => row.category,
            },
            {
                name: "Label",
                selector: (row) => row.label,
            },
            {
                name: "Description",
                selector: (row) => row.description,
            },
            {
                name: "Price",
                sortable: true,
                selector: (row) => row.price,
                cell: (row, index, column, id) => {
                    return <input type="number" value={row.price} id={row.id} onChange={(e) => onEdit(e)} />;
                },
            },
            // {
            //     name: "Edit",
            //     cell: (row, index, column, id) => {
            //         return <button type="button" value={row.price} onClick={(e) => onEdit(row.id)}></button>;
            //     },
            //     button: true,
            // },
        ];
        return (
            <>
                <DataTable columns={columns} data={tableData} theme="solarized" pagination key="1" dense />
            </>
        );
    }
    const onEdit = async (e) => {
        var tempData = [...data];
        data.map((item, index) => {
            if (item.id === parseInt(e.target.id)) {
                tempData[index].price = e.target.value;
            }
        });
        console.log(tempData);
        setData(tempData);
    };
    const onSave = async (e) => {
        localStorage.setItem("data", JSON.stringify(data));
        alert("Saved");
        getFilteredLog(data);
    };
    return (
        <Container>
            {data && categories && (
                <>
                    <Filters>
                        <select id="category" defaultValue={"category"} onChange={(e) => setFilters({ category: e.target.value })}>
                            <option value="category" disabled>
                                Categories
                            </option>
                            <option value="All">All</option>
                            <option value="mains">Mains</option>
                            <option value="appetizer">Appetizer</option>
                            <option value="dessert">Dessert</option>
                            <option value="clone">Clone</option>
                            <option value="weird">Weird</option>
                        </select>
                    </Filters>
                    <TableContainer>{getFilteredLog(data)}</TableContainer>
                    <div id="buttonsContainer">
                        <button id="saveBtn" onClick={() => onSave()}>
                            Save
                        </button>
                        <button id="resetBtn" onClick={() => fetchData()}>
                            Reset
                        </button>
                    </div>
                </>
            )}
        </Container>
    );
}

export default Table;

const Container = styled.div`
    padding: 2rem 1rem;
    #buttonsContainer {
        width: fit-content;
        display: flex;
        gap: 1rem;
        flex-direction: column;
        #saveBtn {
            background-color: green;
        }
        #resetBtn {
        }
        button {
            border: 0;
            border-radius: 5px;
            padding: 5px 15px;
        }
    }
`;
const TableContainer = styled.div`
    border: 1px solid black;
`;
const Filters = styled.div`
    select {
        background-color: white;
        padding: 5px 10px;
        border-radius: 5px;
    }
`;
