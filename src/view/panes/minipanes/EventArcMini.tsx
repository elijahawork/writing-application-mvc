import React from 'react';
import EventArcModel from '../../../models/EventArcModel';

type Props = {
  eventArc: EventArcModel;
};
type State = Props;

class EventArcMini extends React.Component<Props, State> {
  private static readonly WIDTH = 140;
  private static readonly HEIGHT = 140 / 2;

  constructor(props: Props) {
    super(props);
    this.state = { ...props };
  }
  render() {
    console.log(this.state.eventArc);

    return (
      <div>
        <svg
          width={`${EventArcMini.WIDTH}px`}
          height={`${EventArcMini.HEIGHT}px`}
        >
          {Object.keys(this.state.eventArc.eventImportanceMap).map(
            (id, index) => {
              return (
                <path
                  d={`M ${index * this.lineWidth} ${
                    EventArcMini.HEIGHT -
                    ((this.state.eventArc.eventImportanceMap[index - 1] ?? 0) /
                      this.highest) *
                      EventArcMini.HEIGHT
                  } L${(index + 1) * this.lineWidth} ${
                    EventArcMini.HEIGHT -
                    ((this.state.eventArc.eventImportanceMap[index] ?? 0) /
                      this.highest) *
                      EventArcMini.HEIGHT
                  } Z`}
                  stroke={'blue'}
                  key={index}
                />
              );
            }
          )}
        </svg>
      </div>
    );
  }
  get highest(): number {
    return Object.values(this.state.eventArc.eventImportanceMap).sort()[0];
  }
  get lineWidth(): number {
    return (
      EventArcMini.WIDTH /
      Object.keys(this.state.eventArc.eventImportanceMap).length
    );
  }
}
export default EventArcMini;
