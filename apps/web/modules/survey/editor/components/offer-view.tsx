// "use client";

// import { useState } from "react"
// import { LogicEditor } from "@/modules/survey/editor/components/logic-editor";
// import {
//   getDefaultOperatorForQuestion,
//   replaceEndingCardHeadlineRecall,
// } from "@/modules/survey/editor/lib/utils";
// import { AdvancedOptionToggle } from "@/modules/ui/components/advanced-option-toggle";
// import { Button } from "@/modules/ui/components/button";
// import { ColorPicker } from "@/modules/ui/components/color-picker";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/modules/ui/components/select";
// import { Label } from "@/modules/ui/components/label";
// import { Input } from "@/modules/ui/components/input";
// import { useAutoAnimate } from "@formkit/auto-animate/react";
// import { createId } from "@paralleldrive/cuid2";
// import {
//   ArrowDownIcon,
//   ArrowUpIcon,
//   CopyIcon,
//   EllipsisVerticalIcon,
//   PlusIcon,
//   SplitIcon,
//   TrashIcon,
// } from "lucide-react";
// import { useTranslate } from "@tolgee/react";
// import { useMemo } from "react";
// import { duplicateLogicItem } from "@formbricks/lib/surveyLogic/utils";
// import { replaceHeadlineRecall } from "@formbricks/lib/utils/recall";
// import { getStripePlans, getStripeProducts, getStripePromoCodes } from "@formbricks/lib/stripe/service";
// import { TContactAttributeKey } from "@formbricks/types/contact-attribute-key";
// import { TSurvey, TSurveyLogic, TSurveyQuestion, TSurveyQuestionOffer, TOfferOptions } from "@formbricks/types/surveys/types";

// interface OfferViewProps {
//   localSurvey: TSurvey;
//   questionIdx: number;
//   question: TSurveyQuestion;
//   updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
//   contactAttributeKeys: TContactAttributeKey[];
// }

// const initialCondition: TSurveyQuestionOffer = {
//     id: createId(),
//     required: true,
//     actionButton: {
//       required: false,
//       buttonLabel: "Pause Subscription",
//     },
//     offers: {
//       offerType: "offer",
//       offerOptions: "coupon",
//       plan: {
//         id: createId(),
//       },
//       pauseSubcription: {
//         id: createId(),
//         duration: 2,
//         interval: "monthly",
//       },
//       extendTrial: {
//         id: createId(),
//         duration: 2,
//         interval: "daily",
//       },
//     },
// };

// export function OfferView({
//   localSurvey,
//   question,
//   questionIdx,
//   updateQuestion,
// }: OfferViewProps) {
//   const [isOfferViewEnabled, setIsOfferViewEnabled] = useState(false);
//   const [offerType, setOfferType] = useState(initialCondition.offers.offerOptions || "");
//   const { t } = useTranslate();

//   const addLogic = () => {
//     const operator = getDefaultOperatorForQuestion(question, t);

//     const initialCondition: TSurveyLogic = {
//       id: createId(),
//       conditions: {
//         id: createId(),
//         connector: "and",
//         conditions: [
//           {
//             id: createId(),
//             leftOperand: {
//               value: question.id,
//               type: "question",
//             },
//             operator,
//           },
//         ],
//       },
//       actions: [
//         {
//           id: createId(),
//           objective: "jumpToQuestion",
//           target: "",
//         },
//       ],
//     };

//     updateQuestion(questionIdx, {
//       logic: [...(question?.logic ?? []), initialCondition],
//     });
//   };

//   const offerOptions = [
//     {
//         label: "Apply Discount",
//         value: "coupon"
//     },
//     {
//         label: "Pause Subscription",
//         value: "pauseSubscription"
//     },
//     {
//         label: "Subscription Plan",
//         value: "plan"
//     },
//     {
//         label: "Stripe Product",
//         value: "product"
//     },
//     {
//         label: "Extend Free Trial",
//         value: "extendTrial"
//     },
//     {
//         label: "Cancel Subscription",
//         value: "cancel"
//     },
//     {
//         label: "Refund Subscription",
//         value: "refund"
//     },
//   ];

//   const intervalOptions = [
//     {
//         label: "Daily",
//         value: "daily"
//     },
//     {
//         label: "Weekly",
//         value: "weekly"
//     },
//     {
//         label: "Monthly",
//         value: "monthly"
//     },
//     {
//         label: "Yearly",
//         value: "yearly"
//     },
//   ];

//   const addOffer = () => {
//     updateQuestion(questionIdx, {
//       offer: [...(question?.offer ?? []), initialCondition],
//     });
//   };

//   const updateOption = (option: TOfferOptions) => {
//     setOfferType(option);
//     initialCondition.offers.offerOptions = option;
//     updateQuestion(questionIdx, {
//       offer: [...(question?.offer ?? []), initialCondition],
//     });
//   };

//   const updateInterval = (interval: "weekly" | "monthly" | "yearly" | "daily") => {
//     if (initialCondition.offers.pauseSubcription) {
//       initialCondition.offers.pauseSubcription.interval = interval;
//     }
//     updateQuestion(questionIdx, {
//       offer: [...(question?.offer ?? []), initialCondition],
//     });
//   };

//   const updateDuration = (duration: number) => {
//     if (initialCondition.offers.pauseSubcription) {
//       initialCondition.offers.pauseSubcription.duration = duration;
//     }
//     updateQuestion(questionIdx, {
//       offer: [...(question?.offer ?? []), initialCondition],
//     });
//   };

//   const updateTrialInterval = (interval: "weekly" | "monthly" | "yearly" | "daily") => {
//     if (initialCondition.offers.extendTrial) {
//       initialCondition.offers.extendTrial.interval = interval;
//     }
//     updateQuestion(questionIdx, {
//       offer: [...(question?.offer ?? []), initialCondition],
//     });
//   };

//   const updateTrialDuration = (duration: number) => {
//     if (initialCondition.offers.extendTrial) {
//       initialCondition.offers.extendTrial.duration = duration;
//     }
//     updateQuestion(questionIdx, {
//       offer: [...(question?.offer ?? []), initialCondition],
//     });
//   };

//   const handleRemoveLogic = (logicItemIdx: number) => {
//     const logicCopy = structuredClone(question.logic ?? []);
//     const isLast = logicCopy.length === 1;
//     logicCopy.splice(logicItemIdx, 1);

//     updateQuestion(questionIdx, {
//       logic: logicCopy,
//       logicFallback: isLast ? undefined : question.logicFallback,
//     });
//   };

//   const moveLogic = (from: number, to: number) => {
//     const logicCopy = structuredClone(question.logic ?? []);
//     const [movedItem] = logicCopy.splice(from, 1);
//     logicCopy.splice(to, 0, movedItem);

//     updateQuestion(questionIdx, {
//       logic: logicCopy,
//     });
//   };

//   const duplicateLogic = (logicItemIdx: number) => {
//     const logicCopy = structuredClone(question.logic ?? []);
//     const logicItem = logicCopy[logicItemIdx];
//     const newLogicItem = duplicateLogicItem(logicItem);
//     logicCopy.splice(logicItemIdx + 1, 0, newLogicItem);

//     updateQuestion(questionIdx, {
//       logic: logicCopy,
//     });
//   };
//   const [parent] = useAutoAnimate();

//   return (
//     <div ref={parent}>
//       <AdvancedOptionToggle
//             isChecked={isOfferViewEnabled}
//             onToggle={(checked: boolean) => {
//               setIsOfferViewEnabled(checked);
//               addOffer();
//             }}
//             htmlId="offerView"
//             description={t("environments.surveys.edit.character_limit_toggle_description")}
//             childBorder
//             title={t("environments.surveys.edit.character_limit_toggle_title")}
//             customContainerClass="p-0">
//               <div className="flex gap-4 p-4">
//                 <div className="flex items-center space-x-2">
//                       <p className="text-nowrap text-slate-700">
//                           ...trigger the following offer
//                       </p>
//                       <Select
//                           autoComplete="true"
//                           defaultValue={"coupon"}
//                           onValueChange={(val) => {
//                               updateOption(val as TOfferOptions);
//                           }}>
//                           <SelectTrigger className="w-auto bg-white">
//                               <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                               <SelectItem key="fallback_coupon" value={"coupon"}>
//                                   Apply Discount
//                               </SelectItem>
//                               {offerOptions.map((option) => (
//                                   <SelectItem key={`fallback_${option.value}`} value={option.value}>
//                                       <div className="flex items-center gap-2">
//                                           {/* {option.icon} */}
//                                           {option.label}
//                                       </div>
//                                   </SelectItem>
//                               ))}
//                           </SelectContent>
//                       </Select>
//                 </div>
//                 {offerType === "pauseSubscription" && <div className="flex items-center space-x-2">
//                       <p className="text-nowrap text-slate-700">
//                           ...pause the subscroption up to
//                       </p>
//                       <Input
//                           value={1}
//                           type="number"
//                           onChange={(e) => updateDuration(Number(e.target.value))}
//                           placeholder="2"
//                           // className="mt-1"
//                       />
//                       <Select
//                           autoComplete="true"
//                           defaultValue={"monthly"}
//                           onValueChange={(val) => {
//                               updateInterval(val as "weekly" | "monthly" | "yearly" | "daily");
//                           }}>
//                           <SelectTrigger className="w-auto bg-white">
//                               <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                               <SelectItem key="fallback_monthly" value={"monthly"}>
//                                   Monthly
//                               </SelectItem>
//                               {intervalOptions.map((option) => (
//                                   <SelectItem key={`fallback_${option.value}`} value={option.value}>
//                                       <div className="flex items-center gap-2">
//                                           {/* {option.icon} */}
//                                           {option.label}
//                                       </div>
//                                   </SelectItem>
//                               ))}
//                           </SelectContent>
//                       </Select>
//                 </div>}
//                 {offerType === "extendTrial" && <div className="flex items-center space-x-2">
//                       <p className="text-nowrap text-slate-700">
//                           ...extend the trial period up to
//                       </p>
//                       <Input
//                           value={1}
//                           type="number"
//                           onChange={(e) => updateTrialDuration(Number(e.target.value))}
//                           placeholder="2"
//                           // className="mt-1"
//                       />
//                       <Select
//                           autoComplete="true"
//                           defaultValue={"daily"}
//                           onValueChange={(val) => {
//                             updateTrialInterval(val as "weekly" | "monthly" | "yearly" | "daily");
//                           }}>
//                           <SelectTrigger className="w-auto bg-white">
//                               <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                               <SelectItem key="fallback_daily" value={"daily"}>
//                                   Daily
//                               </SelectItem>
//                               {intervalOptions.map((option) => (
//                                   <SelectItem key={`fallback_${option.value}`} value={option.value}>
//                                       <div className="flex items-center gap-2">
//                                           {/* {option.icon} */}
//                                           {option.label}
//                                       </div>
//                                   </SelectItem>
//                               ))}
//                           </SelectContent>
//                       </Select>
//                 </div>}
//               </div>
//               <div>
//                   <AdvancedOptionToggle
//                       isChecked={isOfferViewEnabled}
//                       onToggle={(checked: boolean) => {
//                           setIsOfferViewEnabled(checked);
//                           addOffer();
//                       }}
//                       htmlId="offerView"
//                       description={t("environments.surveys.edit.character_limit_toggle_description")}
//                       childBorder
//                       title={t("environments.surveys.edit.character_limit_toggle_title")}
//                       customContainerClass="p-0">
//                       <div className="flex gap-4 p-4">
//                           <div className="flex-1">
//                               <Label htmlFor="buttonLabel">{t("environments.surveys.edit.button_url")}</Label>
//                               <div className="mt-2">
//                                   <Input
//                                       id="buttonUrl"
//                                       name="buttonUrl"
//                                       value={question.buttonUrl}
//                                       placeholder="https://website.com"
//                                       onChange={(e) => updateQuestion(questionIdx, { buttonUrl: e.target.value })}
//                                   />
//                               </div>
//                           </div>
//                           <div className="mt-3 flex-1">
//                               <Label htmlFor="buttonLabel">Action Button Color</Label>
//                               <div className="mt-2">
//                                   <ColorPicker
//                                       color={field.value || COLOR_DEFAULTS.questionColor}
//                                       onChange={(color) => field.onChange(color)}
//                                       containerClass="max-w-xs"
//                                   />
//                               </div>
//                           </div>
//                       </div>
//                   </AdvancedOptionToggle>
//               </div>
//             </AdvancedOptionToggle>
//       <Label className="flex gap-2">
//         {t("environments.surveys.edit.conditional_logic")}
//         <SplitIcon className="h-4 w-4 rotate-90" />
//       </Label>

//       <div className="mt-2 flex items-center space-x-2">
//         <Button
//           id="logicJumps"
//           type="button"
//           name="logicJumps"
//           size="sm"
//           variant="secondary"
//           onClick={addLogic}>
//           {t("environments.surveys.edit.add_logic")}
//           <PlusIcon />
//         </Button>
//       </div>
//     </div>
//   );
// }