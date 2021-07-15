import historyProvider from "./historyProvider"
import stream from "./stream"
const rp = require("request-promise").defaults({ json: true })

const supportedResolutions = ["1", "3", "5", "15", "30", "60"]

const config = {
  supported_resolutions: supportedResolutions,
  supports_search: false,
}

export default {
  onReady: (cb) => {
    console.log("=====onReady running")
    setTimeout(() => cb(config), 0)
  },

  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    console.log("====Search Symbols running")
    const url = `http://34.69.134.192:3444/currencies?search_query=${userInput.toLowerCase()}`

    rp({
      url: `${url}`,
    })
      .then((data) => {
        const results = []
        data.map((item) => {
          console.log("result", item)
          const searchResult = {
            symbol: item.name,
            full_name: item.name,
            description: item.symbol,
            exchange: item.exchange,
            ticker: item.name + ":" + item.symbol + ":" + item.address, // a concatenated string of needed fields
            type: item.address,
          }
          results.push(searchResult)
        })
        onResultReadyCallback(results)
      })
      .catch((e) => {
        console.log(e)
        onResultReadyCallback([])
      })
  },

  resolveSymbol: (
    symbolTicker,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) => {
    // expects a symbolInfo object in response
    console.log("======resolveSymbol running")
    console.log("resolveSymbol:", { symbolTicker })
    const split_data = symbolTicker.split(":")
    console.log(split_data)
    const symbol_stub = {
      name: split_data[0],
      description: split_data[1],
      type: "crypto",
      session: "24x7",
      timezone: "Etc/UTC",
      ticker: symbolTicker,
      exchange: split_data[2],
      // minmov: 1,
      pricescale: 10000000000,
      has_intraday: true,
      intraday_multipliers: ["1", "60"],
      supported_resolution: supportedResolutions,
      volume_precision: 8,
      data_status: "streaming",
    }

    // if (split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
    //   symbol_stub.pricescale = 100
    // }
    setTimeout(function () {
      onSymbolResolvedCallback(symbol_stub)
      console.log("Resolving that symbol....", symbol_stub)
    }, 0)

    // onResolveErrorCallback('Not feeling it today')
  },
  getBars: function (
    symbolInfo,
    resolution,
    call,
    onHistoryCallback,
    onErrorCallback
  ) {
    console.log("call.from")
    console.log(call.from)
    console.log("call.to")
    console.log(call.to)
    console.log("=====getBars running")
    console.log("function args", arguments)
    console.log(
      `Requesting bars between ${new Date(
        call.from * 1000
      ).toISOString()} and ${new Date(call.to * 1000).toISOString()}`
    )
    historyProvider
      .getBars(
        symbolInfo,
        resolution,
        call.from,
        call.to,
        call.firstDataRequest
      )
      .then((bars) => {
        console.log("=.=.=.=.=.=.")
        console.log(bars)
        console.log("=.=.=.=.=.=.")
        if (bars.length) {
          onHistoryCallback(bars, { noData: false })
        } else {
          onHistoryCallback(bars, { noData: true })
        }
      })
      .catch((err) => {
        console.log({ err })
        // onErrorCallback(err);
      })
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback
  ) => {
    console.log("=====subscribeBars runnning")
    stream.subscribeBars(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscribeUID,
      onResetCacheNeededCallback
    )
  },
  unsubscribeBars: (subscriberUID) => {
    console.log("=====unsubscribeBars running")

    stream.unsubscribeBars(subscriberUID)
  },
  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
    // optional
    console.log("=====calculateHistoryDepth running")
    // while optional, this makes sure we request 24 hours of minute data at a time
    // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
    return resolution < 60
      ? { resolutionBack: "D", intervalBack: "1" }
      : undefined
  },
  getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
    // optional
    console.log("=====getMarks running")
  },
  getTimeScaleMarks: (
    symbolInfo,
    startDate,
    endDate,
    onDataCallback,
    resolution
  ) => {
    // optional
    console.log("startDate")
    console.log(startDate)
    console.log("endDate")
    console.log(endDate)
    console.log("=====getTimeScaleMarks running")
  },
  getServerTime: (cb) => {
    console.log("=====getServerTime running")
  },
}
