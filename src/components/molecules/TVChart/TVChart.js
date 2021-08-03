import * as React from "react"
import { widget } from "../../../charting_library/charting_library"
import Datafeed from "./api"
import { useRef, useEffect } from "react"
import { useAppTheme } from "../../../contexts/appThemeContext"

export default function TVChart(props) {
  const tv = useRef(null)
  const appThemeContext = useAppTheme()
  const widgetOptions = {
    debug: false,
    theme: appThemeContext.darkMode ? "Dark" : "Light",
    symbol: props.symbol || "UNKNOWN",
    interval: "15",
    height: props.height || "calc(100vh - 444px)",
    container_id: props.chartName || "Coin-Chart",
    library_path: "/charting_library/",
    charts_storage_url: "https://saveload.tradingview.com",
    charts_storage_api_version: "1.1",
    client_id: "tradingview.com",
    user_id: "public_user_id",
    datafeed: Datafeed,
    autosize: true,
    studies_overrides: {},
    overrides: {
      "mainSeriesProperties.showCountdown": true,
      "paneProperties.background": "#131722",
      "paneProperties.vertGridProperties.color": "#363c4e",
      "paneProperties.horzGridProperties.color": "#363c4e",
      "symbolWatermarkProperties.transparency": 90,
      "scalesProperties.textColor": "#AAA",
      "mainSeriesProperties.candleStyle.wickUpColor": "#336854",
      "mainSeriesProperties.candleStyle.wickDownColor": "#7f323f",
    },
  }

  useEffect(() => {
    if (tv.current) tv.current.remove()
    tv.current = new widget(widgetOptions)
  }, [props.symbol, appThemeContext.darkMode])

  return (
    <div
      style={{
        height: widgetOptions.height,
      }}
      id={props.chartName || "Coin-Chart"}
    />
  )
}
