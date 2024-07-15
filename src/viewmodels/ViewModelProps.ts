import React from "react";

export interface StandardViewModelProps<TRenderParams> {
    render: (
        parameters: TRenderParams
    ) => React.ReactNode;
}
