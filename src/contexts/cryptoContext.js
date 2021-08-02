import React, { useContext, createContext, useState, useEffect } from "react"
import useSWR from "swr"
import { fetcher } from "../utils/utils"
import {
  API_BASE_URL,
  BUSD,
  BUSD_ADDRESS,
  WBNB_ADDRESS,
} from "../core/environments"
import axios from "axios"

const cryptoContext = createContext()

export function useCrypto() {
  return useContext(cryptoContext)
}

export function ProvideCrypto({ children }) {
  const crypto = useProvideCrypto()
  return (
    <cryptoContext.Provider value={crypto}>{children}</cryptoContext.Provider>
  )
}

function formatTVSymbol(name, symbol, address, quoteCurrency) {
  return `${name}:${symbol}:${address}:${quoteCurrency}`
}

function getCryptoByAddress(address, busd) {
  return axios
    .get(`${API_BASE_URL}/cryptos?search_query=${address}`)
    .then((res) => {
      if (res.data.length > 0) {
        return res.data[0]
      } else {
        return null
      }
    })
    .catch((e) => {
      // console.log(e)
      return e
      // todo: handle error
    })
}

function getCryptoInfoByAddress(address, busd) {
  let quoteCurrency = busd ? BUSD_ADDRESS : WBNB_ADDRESS
  return axios
    .get(
      `${API_BASE_URL}/cryptos/${address}/info?quote_currency=${quoteCurrency}`
    )
    .then((res) => {
      if (res.data) {
        return res.data
      } else {
        return null
      }
    })
    .catch((e) => {
      // console.log(e)
      console.log("error", e)
      return e
      // todo: handle error
    })
}

function useProvideCrypto() {
  const [address, setAddress] = useState(null)
  const [name, setName] = useState(null)
  const [symbol, setSymbol] = useState(null)
  const [tvSymbol, setTVSymbol] = useState(null)
  const [beginningPrice, setBeginningPrice] = useState(null)
  const [currentPrice, setCurrentPrice] = useState(null)
  const [volume, setVolume] = useState(null)
  const [percentChange, setPercentChange] = useState(null)
  const [busd, setBUSD] = useState(false)

  const [cryptoIsLoading, setCryptoIsLoading] = useState(true)
  const [infoIsLoading, setInfoIsLoading] = useState(true)

  useEffect(() => {
    if (address && address != "") {
      setCryptoIsLoading(true)
      getCryptoByAddress(address, busd).then((res) => {
        setCryptoIsLoading(false)

        if (!res) return
        setName(res.name)
        setSymbol(res.symbol)
        setAddress(res.address)
        let quoteCurrencyAddress = busd ? BUSD_ADDRESS : WBNB_ADDRESS
        setTVSymbol(
          formatTVSymbol(
            res.name,
            res.symbol,
            res.address,
            quoteCurrencyAddress
          )
        )
      })

      setInfoIsLoading(true)
      getCryptoInfoByAddress(address, busd).then((res) => {
        setInfoIsLoading(false)

        if (!res) return
        setBeginningPrice(res.beginning_price)
        setCurrentPrice(res.current_price)
        setVolume(res.volume)
        setPercentChange(res.percent_change)
      })
    }
  }, [address, busd])

  return {
    address,
    setAddress,
    name,
    symbol,
    tvSymbol,
    percentChange,
    beginningPrice,
    currentPrice,
    volume,
    setBUSD,
    busd: busd,
    cryptoIsLoading,
    infoIsLoading,
  }
}
