import React, { useState } from 'react'
import MainMenu from './components/MainMenu'
import CitySelector from './components/CitySelector'
import Header from './components/Header'
import AutomacaoFlow from './flows/AutomacaoFlow'
import SiteFlow from './flows/SiteFlow'
import ComboFlow from './flows/ComboFlow'

export default function App() {
  const [screen, setScreen] = useState('menu') // 'menu' | 'city' | 'flow'
  const [mode, setMode] = useState(null)       // 'automacao' | 'site' | 'combo'
  const [cidade, setCidade] = useState(null)   // { nome, multiplicador }

  const handleModeSelect = (m) => {
    setMode(m)
    setScreen('city')
  }

  const handleCitySelect = (city) => {
    setCidade(city)
    setScreen('flow')
  }

  const handleBack = () => {
    if (screen === 'city') setScreen('menu')
    else if (screen === 'flow') setScreen('city')
  }

  const handleHome = () => {
    setScreen('menu')
    setMode(null)
    setCidade(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        mode={screen !== 'menu' ? mode : null}
        cidade={cidade?.nome}
        onBack={screen !== 'menu' ? handleBack : null}
        onHome={handleHome}
      />

      <main className="pt-14">
        {screen === 'menu' && <MainMenu onSelect={handleModeSelect} />}

        {screen === 'city' && (
          <CitySelector onSelect={handleCitySelect} mode={mode} />
        )}

        {screen === 'flow' && cidade && (
          <>
            {mode === 'automacao' && (
              <AutomacaoFlow
                cidade={cidade.nome}
                multiplicador={cidade.multiplicador}
                onBack={handleBack}
              />
            )}
            {mode === 'site' && (
              <SiteFlow
                cidade={cidade.nome}
                multiplicador={cidade.multiplicador}
                onBack={handleBack}
              />
            )}
            {mode === 'combo' && (
              <ComboFlow
                cidade={cidade.nome}
                multiplicador={cidade.multiplicador}
                onBack={handleBack}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
