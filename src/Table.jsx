import React from "react";
import './index.css'

const DataTable = ({ data }) => {
    return (
        <div>
            <h1>Data</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Animal</th>
                        <th>Music Genre</th>
                        <th>Secret Talent</th>
                        <th>Subject</th>
                        <th>Summer</th>
                        <th>TV Show</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(data).map((name) => (
                        <tr key={name}>
                            <td>{name}</td>
                            <td>{data[name]['animal']}</td>
                            <td>{data[name]['music genre']}</td>
                            <td>{data[name]['secret talent']}</td>
                            <td>{data[name]['school subject']}</td>
                            <td>{data[name]['thing they did this summer']}</td>
                            <td>{data[name]['TV show']}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
