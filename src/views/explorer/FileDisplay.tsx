import React, { useState } from "react";

interface IFileDisplay {
    label: string;
    files: IFileDisplay[];
}

export default class FileDisplay extends React.Component<IFileDisplay> {
    constructor(props: IFileDisplay) {
        super(props);
        this.state = {};
    }
    prepareDrag = (ev: React.MouseEvent) => {
        ev.stopPropagation();
    }
    captureDrag = (ev: React.MouseEvent, parent: FileDisplay) => {
        ev.stopPropagation();

        parent.setState({ files: [ ...parent.props.files, this ] });
        
        console.log(parent.props);
        
    }
    render() {
        return (<li draggable={"true"} onDrag={(ev) => this.prepareDrag(ev)}>
            <button onDragEnter={(ev) => this.captureDrag(ev, this)} >{this.props.label}</button>
            <ul>
                {...this.props.files.map((e, i) => <FileDisplay key={i} label={e.label} files={e.files} />)}
            </ul>
        </li>);
    }
}