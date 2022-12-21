import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import BigNumber from 'bignumber.js'

import './app.css'

const operations = {
  plus: '+',
  minus: '-',
  mult: '*',
  div: '/',
}

type RoundOperationsType = {
  [key: string]: string,
};

const roundOptions: RoundOperationsType = {
  math: 'Математическое',
  acc: 'Банковское',
  trunc: 'Усеченное'
}

export const App: FC = () => {
  const [firstNumber, setFirstNumber] = useState('0')
  const [secondNumber, setSecondNumber] = useState('0')
  const [thirdNumber, setThirdNumber] = useState('0')
  const [fourthNumber, setFourthNumber] = useState('0')
  const [firstOperation, setFirstOperation] = useState(operations.plus)
  const [secondOperation, setSecondOperation] = useState(operations.plus)
  const [thirdOperation, setThirdOperation] = useState(operations.plus)
  const [result, setResult] = useState('0')
  const [roundedResult, setRoundedResult] = useState('0')
  const [roundOption, setRoundOption] = useState('math')
  const firstPlusRef = useRef<HTMLDivElement>(null)
  const firstMinusRef = useRef<HTMLDivElement>(null)
  const firstMultRef = useRef<HTMLDivElement>(null)
  const firstDivRef = useRef<HTMLDivElement>(null)
  const secondPlusRef = useRef<HTMLDivElement>(null)
  const secondMinusRef = useRef<HTMLDivElement>(null)
  const secondMultRef = useRef<HTMLDivElement>(null)
  const secondDivRef = useRef<HTMLDivElement>(null)
  const thirdPlusRef = useRef<HTMLDivElement>(null)
  const thirdMinusRef = useRef<HTMLDivElement>(null)
  const thirdMultRef = useRef<HTMLDivElement>(null)
  const thirdDivRef = useRef<HTMLDivElement>(null)

  const setFirstValue = (event: ChangeEvent & { target: HTMLInputElement }) => {
    setFirstNumber(event.target.value)
  }

  const setSecondValue = (
    event: ChangeEvent & { target: HTMLInputElement }
  ) => {
    setSecondNumber(event.target.value)
  }

  const setThirdValue = (event: ChangeEvent & { target: HTMLInputElement }) => {
    setThirdNumber(event.target.value)
  }

  const setFourthValue = (
    event: ChangeEvent & { target: HTMLInputElement }
  ) => {
    setFourthNumber(event.target.value)
  }

  const setRoundOptionValue = (
    event: ChangeEvent<HTMLSelectElement> & { target: HTMLInputElement }
  ) => {
    setRoundOption(event.target.value);
  }

  const checkCorrectSpaces = (numberString: string) => {
    const splitDigits = numberString.split('.').map((item) =>
      item
        .split('')
        .reverse()
        .join('')
        .replace(/\s{2,}/g, ' ')
        .trim()
    )

    if (splitDigits.length > 2) {
      return 'error'
    }

    const isDigitsCorrect = splitDigits.reduce((acc, item) => {
      if (item.includes(' ')) {
        const itemArray = item.split('')
        const spacePosition = 3
        for (let i = spacePosition; i < itemArray.length; i = i + spacePosition + 1) {
          if (itemArray[i] !== ' ') {
            return false
          }
        }
      }

      return acc && true
    }, true)

    return isDigitsCorrect ? numberString : 'error'
  }

  const fractionDigit = 6

  const calcResult = () => {

    const adaptedFirstNumber = checkCorrectSpaces(
      firstNumber.replaceAll(',', '.')
    ).replaceAll(' ', '')
    const adaptedSecondNumber = checkCorrectSpaces(
      secondNumber.replaceAll(',', '.')
    ).replaceAll(' ', '')
    const adaptedThirdNumber = checkCorrectSpaces(
      thirdNumber.replaceAll(',', '.')
    ).replaceAll(' ', '')
    const adaptedFourthNumber = checkCorrectSpaces(
      fourthNumber.replaceAll(',', '.')
    ).replaceAll(' ', '')

    const floatFirstNumber = new BigNumber(adaptedFirstNumber)
    const floatSecondNumber = new BigNumber(adaptedSecondNumber)
    const floatThirdNumber = new BigNumber(adaptedThirdNumber)
    const floatFourthNumber = new BigNumber(adaptedFourthNumber)

    if (
      !(
        `${floatFirstNumber.toString()}` === adaptedFirstNumber &&
        `${floatSecondNumber.toString()}` === adaptedSecondNumber &&
        `${floatThirdNumber.toString()}` === adaptedThirdNumber &&
        `${floatFourthNumber.toString()}` === adaptedFourthNumber
      )
    ) {
      setResult('error')

      return
    }

    let result = new BigNumber(0)

    if (secondOperation === operations.plus) {
      result = new BigNumber(
        (floatSecondNumber.plus(floatThirdNumber)).toFixed(fractionDigit)
      )
    }

    if (secondOperation === operations.minus) {
      result = new BigNumber(
        (floatSecondNumber.minus(floatThirdNumber)).toFixed(fractionDigit)
      )
    }

    if (secondOperation === operations.mult) {
      result = new BigNumber(
        (floatSecondNumber.multipliedBy(floatThirdNumber)).toFixed(fractionDigit)
      )
    }

    if (secondOperation === operations.div) {
      result = new BigNumber(
        (floatSecondNumber.dividedBy(floatThirdNumber)).toFixed(fractionDigit)
      )
    }

    console.log(result.toFixed(fractionDigit))

    if (thirdOperation === operations.mult) {
      result = new BigNumber((result.multipliedBy(floatFourthNumber)).toFixed(fractionDigit))
    }

    if (thirdOperation === operations.div) {
      result = new BigNumber((result.dividedBy(floatFourthNumber)).toFixed(fractionDigit))
    }

    if (firstOperation === operations.plus) {
      result = new BigNumber((floatFirstNumber.plus(result)).toFixed(fractionDigit))
    }

    if (firstOperation === operations.minus) {
      result = new BigNumber((floatFirstNumber.minus(result)).toFixed(fractionDigit))
    }

    if (firstOperation === operations.mult) {
      result = new BigNumber((floatFirstNumber.multipliedBy(result)).toFixed(fractionDigit))
    }

    if (firstOperation === operations.div) {
      result = new BigNumber((floatFirstNumber.dividedBy(result)).toFixed(fractionDigit))
    }

    if (thirdOperation === operations.plus) {
      result = new BigNumber((result.plus(floatFourthNumber)).toFixed(fractionDigit))
    }

    if (thirdOperation === operations.minus) {
      result = new BigNumber((result.minus(floatFourthNumber)).toFixed(fractionDigit))
    }

    setResult(result.toFixed(fractionDigit))
  }

  const evenRound = (num: number, decimalPlaces: number = 0) => {
    const d = decimalPlaces;
    const m = Math.pow(10, d);
    const n = +(d ? num * m : num).toFixed(fractionDigit);
    const i = Math.floor(n), f = n - i;
    const e = 1e-8;
    const r = (f > 0.5 - e && f < 0.5 + e) ?
                ((i % 2 === 0) ? i : i + 1) : Math.round(n);
    return d ? r / m : r;
}

  const calcRoundedResult = () => {
    let roundRes = result;

    if (roundOption === 'math') {
      roundRes = Math.round(parseFloat(result)).toFixed(fractionDigit)
    }

    if (roundOption === 'trunc') {
      roundRes = Math.floor(parseFloat(result)).toFixed(fractionDigit)
    }

    if (roundOption === 'acc') {
      roundRes = evenRound(parseFloat(result)).toFixed(fractionDigit);
    }

    setRoundedResult(roundRes);
  }

  useEffect(() => {
    if (firstOperation === operations.plus) {
      firstPlusRef.current?.classList.add('selected')
      firstMinusRef.current?.classList.remove('selected')
      firstMultRef.current?.classList.remove('selected')
      firstDivRef.current?.classList.remove('selected')
    }

    if (firstOperation === operations.minus) {
      firstMinusRef.current?.classList.add('selected')
      firstPlusRef.current?.classList.remove('selected')
      firstMultRef.current?.classList.remove('selected')
      firstDivRef.current?.classList.remove('selected')
    }

    if (firstOperation === operations.mult) {
      firstMultRef.current?.classList.add('selected')
      firstMinusRef.current?.classList.remove('selected')
      firstPlusRef.current?.classList.remove('selected')
      firstDivRef.current?.classList.remove('selected')
    }

    if (firstOperation === operations.div) {
      firstDivRef.current?.classList.add('selected')
      firstPlusRef.current?.classList.remove('selected')
      firstMinusRef.current?.classList.remove('selected')
      firstMultRef.current?.classList.remove('selected')
    }

    if (secondOperation === operations.plus) {
      secondPlusRef.current?.classList.add('selected')
      secondMinusRef.current?.classList.remove('selected')
      secondMultRef.current?.classList.remove('selected')
      secondDivRef.current?.classList.remove('selected')
    }

    if (secondOperation === operations.minus) {
      secondMinusRef.current?.classList.add('selected')
      secondPlusRef.current?.classList.remove('selected')
      secondMultRef.current?.classList.remove('selected')
      secondDivRef.current?.classList.remove('selected')
    }

    if (secondOperation === operations.mult) {
      secondMultRef.current?.classList.add('selected')
      secondPlusRef.current?.classList.remove('selected')
      secondMinusRef.current?.classList.remove('selected')
      secondDivRef.current?.classList.remove('selected')
    }

    if (secondOperation === operations.div) {
      secondDivRef.current?.classList.add('selected')
      secondPlusRef.current?.classList.remove('selected')
      secondMinusRef.current?.classList.remove('selected')
      secondMultRef.current?.classList.remove('selected')
    }

    if (thirdOperation === operations.plus) {
      thirdPlusRef.current?.classList.add('selected')
      thirdMinusRef.current?.classList.remove('selected')
      thirdMultRef.current?.classList.remove('selected')
      thirdDivRef.current?.classList.remove('selected')
    }

    if (thirdOperation === operations.minus) {
      thirdMinusRef.current?.classList.add('selected')
      thirdPlusRef.current?.classList.remove('selected')
      thirdMultRef.current?.classList.remove('selected')
      thirdDivRef.current?.classList.remove('selected')
    }

    if (thirdOperation === operations.mult) {
      thirdMultRef.current?.classList.add('selected')
      thirdPlusRef.current?.classList.remove('selected')
      thirdMinusRef.current?.classList.remove('selected')
      thirdDivRef.current?.classList.remove('selected')
    }

    if (thirdOperation === operations.div) {
      thirdDivRef.current?.classList.add('selected')
      thirdPlusRef.current?.classList.remove('selected')
      thirdMinusRef.current?.classList.remove('selected')
      thirdMultRef.current?.classList.remove('selected')
    }
  }, [firstOperation, secondOperation, thirdOperation])

  return (
    <>
      <section className="container">
        <div className="number">
          <label htmlFor="first-number">Первое число</label>
          <input
            type="text"
            value={firstNumber}
            onChange={setFirstValue}
            id="first-number"
          ></input>
        </div>
        <div className="operations">
          <div
            className="plus"
            ref={firstPlusRef}
            onClick={() => setFirstOperation(operations.plus)}
          >
            +
          </div>
          <div
            className="minus"
            ref={firstMinusRef}
            onClick={() => setFirstOperation(operations.minus)}
          >
            -
          </div>
          <div
            className="mult"
            ref={firstMultRef}
            onClick={() => setFirstOperation(operations.mult)}
          >
            *
          </div>
          <div
            className="div"
            ref={firstDivRef}
            onClick={() => setFirstOperation(operations.div)}
          >
            /
          </div>
        </div>
        <div className="bracket bracket-left">(</div>
        <div className="number">
          <label htmlFor="second-number">Второе число</label>
          <input
            type="text"
            value={secondNumber}
            onChange={setSecondValue}
            id="second-number"
          ></input>
        </div>
        <div className="operations">
          <div
            className="plus"
            ref={secondPlusRef}
            onClick={() => setSecondOperation(operations.plus)}
          >
            +
          </div>
          <div
            className="minus"
            ref={secondMinusRef}
            onClick={() => setSecondOperation(operations.minus)}
          >
            -
          </div>
          <div
            className="mult"
            ref={secondMultRef}
            onClick={() => setSecondOperation(operations.mult)}
          >
            *
          </div>
          <div
            className="div"
            ref={secondDivRef}
            onClick={() => setSecondOperation(operations.div)}
          >
            /
          </div>
        </div>
        <div className="number">
          <label htmlFor="third-number">Третье число</label>
          <input
            type="text"
            value={thirdNumber}
            onChange={setThirdValue}
            id="third-number"
          ></input>
        </div>
        <div className="bracket bracket-right">)</div>
        <div className="operations">
          <div
            className="plus"
            ref={thirdPlusRef}
            onClick={() => setThirdOperation(operations.plus)}
          >
            +
          </div>
          <div
            className="minus"
            ref={thirdMinusRef}
            onClick={() => setThirdOperation(operations.minus)}
          >
            -
          </div>
          <div
            className="mult"
            ref={thirdMultRef}
            onClick={() => setThirdOperation(operations.mult)}
          >
            *
          </div>
          <div
            className="div"
            ref={thirdDivRef}
            onClick={() => setThirdOperation(operations.div)}
          >
            /
          </div>
        </div>
        <div className="number">
          <label htmlFor="fourth-number">Четвертое число</label>
          <input
            type="text"
            value={fourthNumber}
            onChange={setFourthValue}
            id="fourth-number"
          ></input>
        </div>
        <div className="number">
          <div className="button" onClick={calcResult}>Получить результат</div>
          <div>{result}</div>
        </div>
      </section>
      <section className="container"></section>
      <section className="container">
        <div className="number">
          <label htmlFor='round-options'>Вид округления</label>
          <select
            id='round-options'
            defaultValue={roundOption}
            onChange={setRoundOptionValue}
          >
            {Object.keys(roundOptions).map(key =>
              <option key={key} value={key}>{roundOptions[key]}</option>
            )}
          </select>
        </div>
        <div className="number">
          <div className="button" onClick={calcRoundedResult}>Получить округленный результат</div>
          <div>{roundedResult}</div>
        </div>
      </section>
    </>
  )
}
