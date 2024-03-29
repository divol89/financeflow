import { LiFiWidget } from "@lifi/widget";

export const Widget = () => {
  return (
    <div className="pb-40">
      <LiFiWidget
        config={{
          // fee: 0.03,
          variant: "expandable",
          containerStyle: {
            border: "1px solid rgb(234, 234, 234)",
            borderRadius: "16px",
            backgroundColor: "#FBBF24",
            color: "#1E40AF",
            padding: "8px",
          },
        }}
        integrator="Flow/FinanceFlow"
      />
    </div>
  );
};
