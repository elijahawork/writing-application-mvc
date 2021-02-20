import React, { useState } from "react";
import StoryDivisionModel from "../models/StoryDivisionModel";
import IStoryDivisionSchema from "../schema/IStoryDivisionSchema";
import { StoryDivisionView } from "./StoryDivisionView";

type Props = {
  storyDivisions: StoryDivisionModel[]
}
class StoryDivisionView extends React.Component<Props & IStoryDivisionSchema, Props & IStoryDivisionSchema> {
  render() {
    return <ul draggable={true}>
      { this.state.storyDivisions.map((model: StoryDivisionModel) => <StoryDivisionView id = { model.id } label = { model.label } content = { model.content } parentId = { model.parentId } children = {  }/>)}
    </ul>
  }
}
export default StoryDivisionView;
