import {useEffect, useState} from 'react';
import { Table } from "antd";

function App() {
    const [movies, setMovies] = useState(Array<any>());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(Array<string>());

    useEffect(() => {
        fetch('/api')
            .then(res => res.json())
            .catch(err => setError(err))
            .then(data => {
                setMovies(data.movies);
                setLoading(false);
                setFilters(data.movies
                    .map((movie:any) => movie.genres)
                    .flat().filter((genre:string, index:number, self:string) => self.indexOf(genre) === index)
                    .sort().map((genre:string) => ({text: genre, value: genre}))
                );
            })
    }, [])

    function renderTime(runtime:string) {
        const numRuntime:number = Number.parseInt(runtime)
        return `${Math.trunc(numRuntime/60)}:${numRuntime%60<10?'0':''}${numRuntime%60}`
    }

    const columns:Array<any> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        }, {
            title: 'Poster',
            dataIndex: 'posterUrl',
            key: 'posterUrl',
            render: (poster:any) => <img src={poster} alt="poster not found" width="150px" />
        }, {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            defaultSortOrder: 'descend',
            sorter: (a:any, b:any) => a.rating - b.rating,
        }, {
            title: 'Genres',
            dataIndex: 'genres',
            key: 'genres',
            filters: filters,
            onFilter: (value:string, record:any) => record.genres.includes(value),
            render: (genres:any) => genres.sort().join(', ')
        }, {
            title: 'Year of release',
            dataIndex: 'year',
            key: 'year',
        }, {
            title: 'Plot',
            dataIndex: 'plot',
            key: 'plot',
            ellipsis: true
        }, {
            title: "Duration",
            dataIndex: "runtime",
            key: "runtime",
            render: (runtime:string) => renderTime(runtime)
        }
    ];

    if (error) {
        return (<div>
                <p>something went wrong : {error}</p>
            </div>
        )
    } else {
        return (
            <div>
                <Table dataSource={movies}
                       columns={columns}
                       rowKey="id"
                       loading={loading} />
            </div>
        );
    }
}

export default App

