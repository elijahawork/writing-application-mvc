import React, { useState } from "react";
import Bound from "../../decorators/Bound";

interface IFileDisplay {
    label: string;
    files: IFileDisplay[];
}

export default class FileDisplay extends React.Component<IFileDisplay> {
    constructor(props: IFileDisplay) {
        super(props);
        // [this.state, this.setState] = useState(props);
    }
    @Bound
    prepareDrag() {
        
    }
    render() {
        return <li>
            <button onClick={this.prepareDrag}>{this.props.label}</button>
            <ul>
                {...this.props.files.map((e, i) => <FileDisplay key={ i }label={e.label} files={e.files}/>)}                
            </ul>
        </li>
    }
}