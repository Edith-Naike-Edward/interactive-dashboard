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

export default function WithHighcharts() {
    // const pivotRef: React.RefObject<Pivot> = React.useRef<Pivot>(null);
    const pivotRef = React.useRef<Pivot | null>(null);


    const reportComplete = () => {
        pivotRef.current!.flexmonster.off("reportComplete", reportComplete);
        createChart();
    }

    // Define and create charts on the page. Called when data loading is successfully completed
    const createChart = () => {
        // Here we will place charts rendering later
    }

    return (
        <div className="App">
            <div id="pivot-container" className="">
                <ForwardRefPivot
                    ref={pivotRef}
                    toolbar={true}
                    beforetoolbarcreated={toolbar => {
                        toolbar.showShareReportTab = true;
                    }}
                    shareReportConnection={{
                        url: "https://olap.flexmonster.com:9500"
                    }}
                    width="100%"
                    height={600}
                    report={{
                        dataSource: {
                            type: "csv",
                            // Connect to our dataset
                            filename: "https://query.data.world/s/vvjzn4x5anbdunavdn6lpu6tp2sq3m?dws=00000"
                        }
                    }}
                    reportcomplete={reportComplete}
                    // Your license key
                    licenseKey="XXXX-XXXX-XXXX-XXXX-XXXX"
                />
            </div>
        </div>
    );
}
// "use client";
// import * as React from "react";
// import type { Pivot } from "react-flexmonster";
// import dynamic from "next/dynamic";
// import * as Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";

// // Load the wrapper dynamically
// const PivotWrap = dynamic(() => import("@/app/components/PivotWrapper"), {
//     ssr: false,
//     loading: () => <h1>Loading Dashboard...</h1>
// });

// const ForwardRefPivot = React.forwardRef<Pivot, Flexmonster.Params>((props, ref?: React.ForwardedRef<Pivot>) => 
//     <PivotWrap {...props} pivotRef={ref} />
// );

// ForwardRefPivot.displayName = "ForwardRefPivot";



// // const Dashboard = () => {
// //     return (
// //         <div className="p-4">
// //             <h1 className="text-2xl font-bold">Health Data Analytics</h1>
// //             <ForwardRefPivot
// //                 toolbar={true}
// //                 width="100%"
// //                 height="500px"
// //                 report={{
// //                     dataSource: {
// //                         type: "json",
// //                         data: [
// //                             { Country: "Kenya", Cases: 1500, Deaths: 40 },
// //                             { Country: "Uganda", Cases: 900, Deaths: 30 },
// //                             { Country: "Tanzania", Cases: 1200, Deaths: 25 },
// //                         ],
// //                     },
// //                 }}
// //             />
// //         </div>
// //     );
// // };

// // export default Dashboard;
