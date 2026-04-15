import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button"


export function ClerkProvider({ children }: { children: React.ReactNode }) {
    return (
        <OriginalClerkProvider
        
            signInFallbackRedirectUrl="/app"
            signUpFallbackRedirectUrl="/onboarding"
            appearance = {{
                cssLayerName : "vendor",
                variables: {
                    colorBackground: "var(--color-background)",
                    borderRadius: "var(--radius-md)",
                    colorDanger: "var(--color-destructive)",
                    colorForeground: "var(--color-foreground)",
                    colorPrimary: "var(--color-primary)",
                    colorPrimaryForeground: "var(--color-primary-foreground)",
                    colorInput: "var(--color-input)",
                    colorInputForeground: "var(--color-text)",
                    colorMuted: "var(--color-muted)",
                    colorMutedForeground: "var(--color-muted-foreground)",
                    colorNeutral: "var(--color-secondary-foreground)",
                    colorRing: "var(--color-ring)",
                    colorShadow: "var(--color-shadow-color)",
                    colorSuccess: "var(--color-primary)",
                    colorWarning: "var(--color-warning)",
                    fontFamily: "var(--font-sans)",
                    fontFamilyButtons: "var(--font-sans)",
                    colorBorder: "var(--color-secondary-foreground)",
                },
                elements: {
                    pricingTableCardHeader: "p-0 pb-12",
                    pricingTableCardTitle: "text-xl",
                    pricingTableCardBody:"flex flex-col justify-end bg-none bg-[unset] *:bg-none *:bg-[unset] [&>.cl-pricingTableCardFeatures]:justify-items-end",
                    pricingTableCardDescription: "text-muted-foreground text-sm mb-2",
                    pricingTableCardFeeContainer: "items-baseline gap-0.5",
                    pricingTableCardFee: "text-4xl",
                    pricingTableCardFeePeriodNotice: "hidden",
                    pricingTableCardFeePeriod: "text-base text-muted-foreground",
                    pricingTableCardFeatures: "p-0 border-none",
                    pricingTableCardFeaturesListItem: "[&>svg]:text-primary",
                    pricingTableCardFeaturesListItemTitle: "text-sm",
                    pricingTableCardFooter: "p-0 pt-8 border-none",
                    pricingTableCardFooterButton: buttonVariants(),
                    pricingTableCard:"custom-pricing-table bg-none bg-[unset] border border-border p-6 my-3",
                },
            }}
            
        >
            {children}
        </OriginalClerkProvider>
    )   
}
