const Index = () => {
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>⛽ Gas Tracker</h1>
            </div>
            <div className="wallet-section">
              <div className="wallet-info" id="wallet-info" style={{ display: "none" }}>
                <div className="wallet-address">
                  <span className="address-label">Connected:</span>
                  <span className="address-value" id="wallet-address">0x...</span>
                </div>
                <div className="wallet-balances">
                  <div className="balance-item">
                    <span className="balance-network">ETH</span>
                    <span className="balance-amount" id="eth-balance">0.00</span>
                  </div>
                  <div className="balance-item">
                    <span className="balance-network">ARB</span>
                    <span className="balance-amount" id="arb-balance">0.00</span>
                  </div>
                </div>
              </div>
              <button className="btn btn--primary" id="connect-wallet">
                Connect MetaMask
              </button>
            </div>
            <div className="network-selector">
              <button className="btn btn--network active" data-network="ethereum">
                <span className="network-dot" style={{ backgroundColor: "#627EEA" }} />
                Ethereum
              </button>
              <button className="btn btn--network" data-network="polygon">
                <span className="network-dot" style={{ backgroundColor: "#8247E5" }} />
                Polygon
              </button>
              <button className="btn btn--network" data-network="arbitrum">
                <span className="network-dot" style={{ backgroundColor: "#28A0F0" }} />
                Arbitrum
              </button>
            </div>
            <div className="eth-price">
              <span className="price-label">ETH</span>
              <span className="price-value" id="eth-price">$3,420.50</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <div className="dashboard-grid">
            {/* Gas Price Cards */}
            <section className="gas-cards">
              <div className="card gas-card">
                <div className="card__body">
                  <div className="gas-type">
                    <span className="gas-icon">🐌</span>
                    <span className="gas-label">Slow</span>
                  </div>
                  <div className="gas-price">
                    <span className="price" id="slow-price">25</span>
                    <span className="unit">gwei</span>
                  </div>
                  <div className="gas-time">~5 min</div>
                  <div className="gas-usd" id="slow-usd">$2.34</div>
                </div>
              </div>
              <div className="card gas-card">
                <div className="card__body">
                  <div className="gas-type">
                    <span className="gas-icon">🚀</span>
                    <span className="gas-label">Standard</span>
                  </div>
                  <div className="gas-price">
                    <span className="price" id="standard-price">30</span>
                    <span className="unit">gwei</span>
                  </div>
                  <div className="gas-time">~2 min</div>
                  <div className="gas-usd" id="standard-usd">$2.93</div>
                </div>
              </div>
              <div className="card gas-card">
                <div className="card__body">
                  <div className="gas-type">
                    <span className="gas-icon">⚡</span>
                    <span className="gas-label">Fast</span>
                  </div>
                  <div className="gas-price">
                    <span className="price" id="fast-price">40</span>
                    <span className="unit">gwei</span>
                  </div>
                  <div className="gas-time">~30 sec</div>
                  <div className="gas-usd" id="fast-usd">$3.51</div>
                </div>
              </div>
            </section>

            {/* Chart Section */}
            <section className="chart-section">
              <div className="card">
                <div className="card__body">
                  <div className="chart-header">
                    <h3>Gas Price Trends</h3>
                    <div className="chart-controls">
                      <button className="btn btn--sm btn--outline active" data-timeframe="1h">1H</button>
                      <button className="btn btn--sm btn--outline" data-timeframe="24h">24H</button>
                      <button className="btn btn--sm btn--outline" data-timeframe="7d">7D</button>
                      <select className="chart-type-select" id="chart-type" defaultValue="line">
                        <option value="line">Line Chart</option>
                        <option value="candlestick">Candlestick</option>
                        <option value="bar">Bar Chart</option>
                      </select>
                    </div>
                  </div>
                  <div className="chart-container">
                    <canvas id="gas-chart"></canvas>
                  </div>
                </div>
              </div>
            </section>

            {/* Transaction Simulator */}
            <section className="simulator-section">
              <div className="card">
                <div className="card__body">
                  <h3>Transaction Simulator</h3>
                  <div className="simulator-form">
                    <div className="form-group">
                      <label className="form-label">Transaction Type</label>
                      <select className="form-control" id="tx-type" defaultValue="transfer">
                        <option value="transfer">ETH Transfer</option>
                        <option value="erc20">ERC-20 Transfer</option>
                        <option value="swap">DEX Swap</option>
                        <option value="nft">NFT Mint</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Amount</label>
                      <input type="number" className="form-control" id="tx-amount" placeholder="1.0" step="0.1" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gas Priority</label>
                      <select className="form-control" id="gas-priority" defaultValue="standard">
                        <option value="slow">Slow</option>
                        <option value="standard">Standard</option>
                        <option value="fast">Fast</option>
                      </select>
                    </div>
                    <button className="btn btn--primary btn--full-width" id="simulate-btn">
                      Simulate Transaction
                    </button>
                  </div>
                  <div className="simulation-results" id="simulation-results" style={{ display: "none" }}>
                    <div className="results-grid">
                      <div className="result-item">
                        <span className="result-label">Gas Limit</span>
                        <span className="result-value" id="result-gas-limit">21,000</span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Gas Price</span>
                        <span className="result-value" id="result-gas-price">30 gwei</span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Total Fee</span>
                        <span className="result-value" id="result-total-fee">$2.93</span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Total Cost</span>
                        <span className="result-value" id="result-total-cost">$3,423.43</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Gas Price Alerts */}
            <section className="alerts-section">
              <div className="card">
                <div className="card__body">
                  <h3>Gas Price Alerts</h3>
                  <div className="alert-form">
                    <div className="form-group">
                      <label className="form-label">Alert Threshold (gwei)</label>
                      <input type="number" className="form-control" id="alert-threshold" placeholder="20" step={1} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Alert Type</label>
                      <select className="form-control" id="alert-type" defaultValue="below">
                        <option value="below">Below threshold</option>
                        <option value="above">Above threshold</option>
                      </select>
                    </div>
                    <button className="btn btn--secondary btn--full-width" id="set-alert-btn">
                      Set Alert
                    </button>
                  </div>
                  <div className="active-alerts" id="active-alerts">
                    <div className="alert-item">
                      <span className="alert-text">Alert when gas drops below 25 gwei</span>
                      <span className="status status--success">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Network Stats */}
            <section className="stats-section">
              <div className="card">
                <div className="card__body">
                  <h3>Network Statistics</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Block Time</span>
                      <span className="stat-value" id="block-time">12s</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Base Fee</span>
                      <span className="stat-value" id="base-fee">22 gwei</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Network</span>
                      <span className="stat-value" id="current-network">Ethereum</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Status</span>
                      <span className="status status--success">🟢 Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="activity-section">
              <div className="card">
                <div className="card__body">
                  <h3>Recent Activity</h3>
                  <div className="activity-list" id="activity-list"></div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="update-info">
              <span>Last updated: <span id="last-updated">--</span></span>
            </div>
            <div className="data-sources">
              <span>Data from Ethereum, Polygon, and Arbitrum networks</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Notification Toast */}
      <div className="notification-toast" id="notification-toast">
        <div className="toast-content">
          <span className="toast-message" id="toast-message"></span>
          <button className="toast-close" id="toast-close">&times;</button>
        </div>
      </div>
    </div>
  );
};

export default Index;

