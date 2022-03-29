import { useState, useEffect } from "react"
import * as C from "./App.styles"

import { GridItemType } from "./types/GridItemType"
import { items } from "./data/items"

import LogoImage from "./assets/devmemory_logo.png"
import RestartIcon from "./svgs/restart.svg"

import { InfoItem } from "./components/InfoItem"
import { Button } from "./components/Button"
import { GridItem } from "./components/GridItem"

import { formatTimeElapsed } from "./helpers/formatTimeElapsed"

const App = () => {

    const [ playing, setPlaying ] = useState<boolean>(false)
    const [ timeElapsed, setTimeElapsed ] = useState<number>(0)
    const [ moveCount, setMoveCount ] = useState<number>(0)
    const [ shownCount, setShownCount ] = useState<number>(0)
    const [ gridItems, setGridItems ] = useState<GridItemType[]>([])

    useEffect(() => resetAndCreateGrid(), [])

    useEffect(() => {
        const timer = setInterval(() => {
            if(playing) setTimeElapsed(timeElapsed + 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [playing, timeElapsed])

    // Verificar se os items abertos são iguais
    useEffect(() => {
        if(shownCount === 2) {
            let opened = gridItems.filter(item => item.shown === true)
            if(opened.length === 2) {

                // Se os items são iguais, tornalos permanentes
                if(opened[0].item === opened[1].item) {
                    let tmpGrid = [...gridItems]
                    for(let i in tmpGrid) {
                        if(tmpGrid[i].shown) {
                            tmpGrid[i].permanentShown = true
                            tmpGrid[i].shown = false
                        }
                    }
                    setGridItems(tmpGrid)
                    setShownCount(0)
                } else {
                    // Se os items não são iguais, fechamos eles definindo o show para false
                    setTimeout(() => {
                        let tmpGrid = [...gridItems]
                        for(let i in tmpGrid) {
                            tmpGrid[i].shown = false
                        }
                        setGridItems(tmpGrid)
                        setShownCount(0)
                    }, 1000)
                }

                setMoveCount(moveCount => moveCount + 1)
            }
        }
    }, [shownCount, gridItems])

    // Verificar se o jogo acabou
    useEffect(() => {
        // Função every verifica se todos os items do array tem a chave permanentShown como true
        if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
            setPlaying(false)
        }
    }, [moveCount, gridItems])

    const resetAndCreateGrid = () => {

        // Passo 1: Resetar o jogo
        setTimeElapsed(0)
        setMoveCount(0)
        setShownCount(0)

        // Passo 2: Criar o grid e começar o jogo
        // Passo 2.1: Criar um grid vazio
        let tmpGrid: GridItemType[] = []
        for(let i = 0; i < (items.length * 2); i++) {
            tmpGrid.push({
                item: null, shown: false, permanentShown: false
            })
        }

        // 2.2 Preencher o grid
        for(let w = 0; w < 2; w++) {
            for(let i = 0; i < items.length; i++) {
                let pos = -1;
                while(pos < 0 || tmpGrid[pos].item !== null) {
                    pos = Math.floor(Math.random() * items.length * 2)
                }
                tmpGrid[pos].item = i
            }
        }

        // 2.3 Jogar no state
        setGridItems(tmpGrid)

        // Passo 3: Começar o jogo
        setPlaying(true)
    }

    const handleItemClick = (index: number) => {
        if(playing && index !== null && shownCount < 2) {
            let tmpGrid = [...gridItems]

            if(!tmpGrid[index].permanentShown && !tmpGrid[index].shown) {
                tmpGrid[index].shown = true
                setShownCount(shownCount + 1)
            }

            setGridItems(tmpGrid)
        }
    }

    return (
        <C.Container>
            <C.Info>
                <C.LogoLink href="">
                    <img src={LogoImage} width="200" alt="" />
                </C.LogoLink>

                <C.InfoArea>
                    <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
                    <InfoItem label="Movimentos" value={moveCount.toString()} />
                </C.InfoArea>

                <Button
                    label="Reiniciar"
                    icon={RestartIcon}
                    onClick={resetAndCreateGrid}
                />
            </C.Info>
            <C.GridArea>
                <C.Grid>
                    {gridItems.map((item,index) => (
                        <GridItem
                            key={index}
                            item={item}
                            onClick={() => handleItemClick(index)}
                        />
                    ))}
                </C.Grid>
            </C.GridArea>
        </C.Container>
    )
}

export default App