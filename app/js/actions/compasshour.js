import { createActions } from 'redux-actions';
import {
  COMPASS_HOUR_CLICK,
  COMPASS_HOUR_BASETIME_CHANGE,
  COMPASS_HOUR_VALIDTIME_CHANGE,
  COMPASS_HOUR_TMP_CLICK,
  COMPASS_HOUR_TMP_CONTOUR_CLICK,
  COMPASS_HOUR_TMP_CONTOUR_UNIT,
  COMPASS_HOUR_TMP_GRIDVALUE_CLICK,
  COMPASS_HOUR_TMP_GRIDVALUE_UNIT,
  COMPASS_HOUR_TMP_FILL_CHANGE,
  COMPASS_HOUR_PRES_CLICK,
  COMPASS_HOUR_PRES_CONTOUR_CLICK,
  COMPASS_HOUR_PRES_GRIDVALUE_CLICK,
  COMPASS_HOUR_PRES_FILL_CHANGE,
  COMPASS_HOUR_RH_CLICK,
  COMPASS_HOUR_RH_CONTOUR_CLICK,
  COMPASS_HOUR_RH_GRIDVALUE_CLICK,
  COMPASS_HOUR_RH_FILL_CHANGE,
  COMPASS_HOUR_ASNOW_CLICK,
  COMPASS_HOUR_ASNOW_CONTOUR_CLICK,
  COMPASS_HOUR_ASNOW_GRIDVALUE_CLICK,
  COMPASS_HOUR_ASNOW_FILL_CHANGE,
  COMPASS_HOUR_APCP_CLICK,
  COMPASS_HOUR_APCP_CONTOUR_CLICK,
  COMPASS_HOUR_APCP_GRIDVALUE_CLICK,
  COMPASS_HOUR_APCP_FILL_CHANGE,
  COMPASS_HOUR_POP_CLICK,
  COMPASS_HOUR_POP_CONTOUR_CLICK,
  COMPASS_HOUR_POP_GRIDVALUE_CLICK,
  COMPASS_HOUR_POP_FILL_CHANGE,
  COMPASS_HOUR_UGRDVGRD_CLICK,
  COMPASS_HOUR_UGRDVGRD_BARBS_CLICK,
  COMPASS_HOUR_VIS_CLICK,
  COMPASS_HOUR_VIS_CONTOUR_CLICK,
  COMPASS_HOUR_VIS_GRIDVALUE_CLICK,
  COMPASS_HOUR_VIS_FILL_CHANGE,
  COMPASS_HOUR_WIWW_CLICK,
  COMPASS_HOUR_WIWW_CONTOUR_CLICK,
  COMPASS_HOUR_WIWW_GRIDVALUE_CLICK,
  COMPASS_HOUR_WIWW_FILL_CHANGE,
} from '../constants/compasshour/ActionTypes';
import {
  CompassHourTmpContour,
  CompassHourTmpGridValue,
  CompassHourTmpFill,
  CompassHourPresContour,
  CompassHourPresGridValue,
  CompassHourPresFill,
  CompassHourRhContour,
  CompassHourRhGridValue,
  CompassHourRhFill,
  CompassHourAsnowContour,
  CompassHourAsnowGridValue,
  CompassHourAsnowFill,
  CompassHourApcpContour,
  CompassHourApcpGridValue,
  CompassHourApcpFill,
  CompassHourPopContour,
  CompassHourPopGridValue,
  CompassHourPopFill,
  CompassHourUgrdvgrdBarbs,
  CompassHourVisContour,
  CompassHourVisGridValue,
  CompassHourVisFill,
  CompassHourWiwwContour,
  CompassHourWiwwGridValue,
  CompassHourWiwwFill,
  } from '../layers/LayerConfig';

const targetLayer = [
  CompassHourTmpContour.layerName,
  CompassHourTmpGridValue.layerName,
  CompassHourTmpFill.layerName,
  CompassHourPresContour.layerName,
  CompassHourPresGridValue.layerName,
  CompassHourPresFill.layerName,
  CompassHourRhContour.layerName,
  CompassHourRhGridValue.layerName,
  CompassHourRhFill.layerName,
  CompassHourAsnowContour.layerName,
  CompassHourAsnowGridValue.layerName,
  CompassHourAsnowFill.layerName,
  CompassHourApcpContour.layerName,
  CompassHourApcpGridValue.layerName,
  CompassHourApcpFill.layerName,
  CompassHourPopContour.layerName,
  CompassHourPopGridValue.layerName,
  CompassHourPopFill.layerName,
  CompassHourUgrdvgrdBarbs.layerName,
  CompassHourVisContour.layerName,
  CompassHourVisGridValue.layerName,
  CompassHourVisFill.layerName,
  CompassHourWiwwContour.layerName,
  CompassHourWiwwGridValue.layerName,
  CompassHourWiwwFill.layerName,
];

const checkAction = checked => ({ checked, targetLayer });
const valueAction = value => ({ value, targetLayer });

export const {
  compassHourClick,
  compassHourBasetimeChange,
  compassHourValidtimeChange,
  compassHourTmpClick,
  compassHourTmpcontourClick,
  compassHourTmpcontourUnit,
  compassHourTmpgridvalueClick,
  compassHourTmpgridvalueUnit,
  compassHourTmpfillChange,
  compassHourPresClick,
  compassHourPrescontourClick,
  compassHourPresgridvalueClick,
  compassHourPresfillChange,
  compassHourRhClick,
  compassHourRhcontourClick,
  compassHourRhgridvalueClick,
  compassHourRhfillChange,
  compassHourAsnowClick,
  compassHourAsnowcontourClick,
  compassHourAsnowgridvalueClick,
  compassHourAsnowfillChange,
  compassHourApcpClick,
  compassHourApcpcontourClick,
  compassHourApcpgridvalueClick,
  compassHourApcpfillChange,
  compassHourPopClick,
  compassHourPopcontourClick,
  compassHourPopgridvalueClick,
  compassHourPopfillChange,
  compassHourUgrdvgrdClick,
  compassHourUgrdvgrdbarbsClick,
  compassHourUgrdgridvalueClick,
  compassHourVgrdgridvalueClick,
  compassHourVisClick,
  compassHourViscontourClick,
  compassHourVisgridvalueClick,
  compassHourVisfillChange,
  compassHourWiwwClick,
  compassHourWiwwcontourClick,
  compassHourWiwwgridvalueClick,
  compassHourWiwwfillChange,
} = createActions({
  [COMPASS_HOUR_CLICK]: checkAction,
  [COMPASS_HOUR_BASETIME_CHANGE]: valueAction,
  [COMPASS_HOUR_VALIDTIME_CHANGE]: valueAction,
  [COMPASS_HOUR_TMP_CLICK]: checkAction,
  [COMPASS_HOUR_TMP_CONTOUR_CLICK]: checkAction,
  [COMPASS_HOUR_TMP_CONTOUR_UNIT]: valueAction,
  [COMPASS_HOUR_TMP_GRIDVALUE_CLICK]: checkAction,
  [COMPASS_HOUR_TMP_GRIDVALUE_UNIT]: valueAction,
  [COMPASS_HOUR_TMP_FILL_CHANGE]: valueAction,
  [COMPASS_HOUR_PRES_CLICK]: checkAction,
  [COMPASS_HOUR_PRES_CONTOUR_CLICK]: checkAction,
  [COMPASS_HOUR_PRES_GRIDVALUE_CLICK]: checkAction,
  [COMPASS_HOUR_PRES_FILL_CHANGE]: valueAction,
  [COMPASS_HOUR_RH_CLICK]: checkAction,
  [COMPASS_HOUR_RH_CONTOUR_CLICK]: checkAction,
  [COMPASS_HOUR_RH_GRIDVALUE_CLICK]: checkAction,
  [COMPASS_HOUR_RH_FILL_CHANGE]: valueAction,
  [COMPASS_HOUR_ASNOW_CLICK]: checkAction,
  [COMPASS_HOUR_ASNOW_CONTOUR_CLICK]: checkAction,
  [COMPASS_HOUR_ASNOW_GRIDVALUE_CLICK]: checkAction,
  [COMPASS_HOUR_ASNOW_FILL_CHANGE]: valueAction,
  [COMPASS_HOUR_APCP_CLICK]: checkAction,
  [COMPASS_HOUR_APCP_CONTOUR_CLICK]: checkAction,
  [COMPASS_HOUR_APCP_GRIDVALUE_CLICK]: checkAction,
  [COMPASS_HOUR_APCP_FILL_CHANGE]: valueAction,
  [COMPASS_HOUR_POP_CLICK]: checkAction,
  [COMPASS_HOUR_POP_CONTOUR_CLICK]: checkAction,
  [COMPASS_HOUR_POP_GRIDVALUE_CLICK]: checkAction,
  [COMPASS_HOUR_POP_FILL_CHANGE]: valueAction,
  [COMPASS_HOUR_UGRDVGRD_CLICK]: checkAction,
  [COMPASS_HOUR_UGRDVGRD_BARBS_CLICK]: checkAction,
  [COMPASS_HOUR_VIS_CLICK]: checkAction,
  [COMPASS_HOUR_VIS_CONTOUR_CLICK]: checkAction,
  [COMPASS_HOUR_VIS_GRIDVALUE_CLICK]: checkAction,
  [COMPASS_HOUR_VIS_FILL_CHANGE]: valueAction,
  [COMPASS_HOUR_WIWW_CLICK]: checkAction,
  [COMPASS_HOUR_WIWW_CONTOUR_CLICK]: checkAction,
  [COMPASS_HOUR_WIWW_GRIDVALUE_CLICK]: checkAction,
  [COMPASS_HOUR_WIWW_FILL_CHANGE]: valueAction,
});
