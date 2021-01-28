import React from "react";
import FileDisplay from "./FileDisplay";

export default class Explorer extends React.Component {
    render() {
        return <div>
            <FileDisplay label = {'main'} files={[
                {
                    label: 'Folder 1',
                    files: []
                }
            ]} />
        </div>
    }
}