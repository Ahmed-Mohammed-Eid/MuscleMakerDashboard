"use client";
import {Chart} from 'primereact/chart';

export default function ClientsChart({clients}) {
    return (
        <Chart
            type="pie"
            data={{
                labels: ['All', 'Active', 'Inactive'],
                datasets: [
                    {
                        label: 'Clients',
                        data: [clients.all, clients.active, clients.inActive],
                        backgroundColor: ["#63c3ff", "#69eb36", "#ff5656"],
                    },
                ],
            }}
        />
    )
}