'use client';
import React, {useEffect, useState} from "react";
import useAxios from "../hooks/useAxois";
import {AllCommunityModule, ModuleRegistry, colorSchemeDarkWarm, themeQuartz} from "ag-grid-community";
import {AgGridReact} from "ag-grid-react";
import Link from "next/link";
ModuleRegistry.registerModules([AllCommunityModule]);
const themeDarkBlue = themeQuartz.withPart(colorSchemeDarkWarm);


const CustomButtonComponent = (props) => {
    return <Link href={`/dealers/${props?.data?.id}`} className={'rounded hover:bg-gray-400 border-2 border-gray-200 p-1'}>See Details</Link>;
};

export default function Dealers() {
    const {data, loading, error, sendRequest} = useAxios();
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        if (data) {
            console.log(data)
            setRowData(data.dealers)
        } else {
            sendRequest({method: 'GET', endpoint: '/djangoapp/get_dealers'})
        }
    }, [data]);


    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "id",
            valueGetter: (p) => p.data.id,
            flex: 1,
        },
        {
            headerName: "Short Name",
            valueGetter: (p) => p.data.short_name,
            flex: 2,
        },
        {
            headerName: "Address",
            valueGetter: (p) => p.data.address,
            flex: 2,
        },
        {
            headerName: "state",
            valueGetter: (p) => p.data.state,
            flex: 2,
        },
        {
            headerName: "city",
            valueGetter: (p) => p.data.city,
            flex: 2,
        },
        {
            headerName: "zipcode",
            valueGetter: (p) => p.data.zip,
            flex: 2,
        },
        {field: "action", cellRenderer: CustomButtonComponent, flex: 2},
    ]);

    return (
        <div className={'container mx-auto h-[75vh] flex items-center'}>
            <div style={{width: "100%", height: "500px"}} className={'bg-black'}>
                <AgGridReact theme={themeDarkBlue} rowData={rowData} columnDefs={columnDefs}/>
            </div>
        </div>
    );
};

