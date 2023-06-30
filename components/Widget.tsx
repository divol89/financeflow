// import { LiFiWidget } from '@lifi/widget';
// import { WidgetEvents } from './WidgetEvents';

// export const Widget = () => {
//   return (
//     <>
//       <WidgetEvents />
//       <LiFiWidget
//         config={{
//           containerStyle: {
//             border: `1px solid rgb(234, 234, 234)`,
//             borderRadius: '16px',
//           },
//         }}
//         integrator="Beq/FlowFinance"
//       />
//     </>
//   );
// };

// import { LiFiWidget } from '@lifi/widget';
// import { WidgetEvents } from './WidgetEvents';

// export const Widget = () => {
//   return (
//     <div className='flex justify-center overflow-none px-4 '>
//     <div className="w-3/4 overflow-none">

//       <WidgetEvents />

//       <LiFiWidget
//         config={{
//           variant: 'expandable',
//           containerStyle: {
//             border: '1px solid rgb(234, 234, 234)',
//             borderRadius: '16px',
//             backgroundColor: '#FBBF24',
//             color: '#1E40AF',
//             padding: '8px',
//           },
//         }}
//         integrator="Beq/FlowFinance"
//       />
            

//     </div>
//     </div>
//   );
// };



import { LiFiWidget } from '@lifi/widget';
import { WidgetEvents } from './WidgetEvents';




export const Widget = () => {
  return (
    
      <div className='pb-40'>
        <WidgetEvents />

        <LiFiWidget
          config={{
            // fee: 0.03,
            variant: 'expandable',
            containerStyle: {
              border: '1px solid rgb(234, 234, 234)',
              borderRadius: '16px',
              backgroundColor: '#FBBF24',
              color: '#1E40AF',
              padding: '8px',
              
            },
          }}
          integrator="Flow/FinanceFlow"
        />

      </div>
   
  );
};





