"use client";
import * as React from "react";
import type { Pivot } from "react-flexmonster";
import dynamic from "next/dynamic";
// import * as Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";

// Load the wrapper dynamically
const PivotWrap = dynamic(() => import("@/app/components/PivotWrapper"), {
    ssr: false,
    loading: () => <h1>Loading Dashboard...</h1>
});

const ForwardRefPivot = React.forwardRef<Pivot, Flexmonster.Params>((props, ref?: React.ForwardedRef<Pivot>) => 
    <PivotWrap {...props} pivotRef={ref} />
);

ForwardRefPivot.displayName = "ForwardRefPivot";

// const Dashboard = () => {
//     return (
//         <div className="p-4">
//             <h1 className="text-2xl font-bold">Health Data Analytics</h1>
//             <ForwardRefPivot
//                 toolbar={true}
//                 width="100%"
//                 height="500px"
//                 report={{
//                     dataSource: {
//                         type: "json",
//                         data: [
//                             { Country: "Kenya", Cases: 1500, Deaths: 40 },
//                             { Country: "Uganda", Cases: 900, Deaths: 30 },
//                             { Country: "Tanzania", Cases: 1200, Deaths: 25 },
//                         ],
//                     },
//                 }}
//             />
//         </div>
//     );
// };

// export default Dashboard;
