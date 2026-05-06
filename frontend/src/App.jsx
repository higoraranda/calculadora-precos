import React, { useState } from 'react'
import MainMenu from './components/MainMenu'
import CitySelector from './components/CitySelector'
import ClientForm from './components/ClientForm'
import Header from './components/Header'
import AutomacaoFlow from './flows/AutomacaoFlow'
import SiteFlow from './flows/SiteFlow'
import ComboFlow from './flows/ComboFlow'

export default function App() {
  const [screen, setScreen] = useState('menu') // 'menu' | 'city' | 'client' | 'flow'
  const [mode, setMode] = useState(null)       // 'automacao' | 'site' | 'combo'
  const [cidade, setCidade] = useState(null)   // { nome, multiplicador }
  const [clientInfo, setClientInfo] = useState({ nome: '', telefone: '' })

  const handleModeSelect = (m) => {
    setMode(m)
    setScreen('city')
  }

  const handleCitySelect = (city) => {
    setCidade(city)
    setScreen('client')
  }

  const handleClientConfirm = (info) => {
    setClientInfo(info)
    setScreen('flow')
  }

  const handleBack = () => {
    if (screen === 'city') setScreen('menu')
    else if (screen === 'client') setScreen('city')
    else if (screen === 'flow') setScreen('client')
  }

  const handleHome = () => {
    setScreen('menu')
    setMode(null)
    setCidade(null)
    setClientInfo({ nome: '', telefone: '' })
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

        {screen === 'client' && (
          <ClientForm onConfirm={handleClientConfirm} onBack={() => setScreen('city')} />
        )}

        {screen === 'flow' && cidade && (
          <>
            {mode === 'automacao' && (
              <AutomacaoFlow
                cidade={cidade.nome}
                multiplicador={cidade.multiplicador}
                onBack={handleBack}
                clientInfo={clientInfo}
              />
            )}
            {mode === 'site' && (
              <SiteFlow
                cidade={cidade.nome}
                multiplicador={cidade.multiplicador}
                onBack={handleBack}
                clientInfo={clientInfo}
              />
            )}
            {mode === 'combo' && (
              <ComboFlow
                cidade={cidade.nome}
                multiplicador={cidade.multiplicador}
                onBack={handleBack}
                clientInfo={clientInfo}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
