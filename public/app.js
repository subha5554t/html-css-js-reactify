// Web3 Gas Price Tracker JavaScript with MetaMask Integration

// Application data with real gas data structure
const appData = {
  gasData: {
    ethereum: {
      slow: 25,
      standard: 30,
      fast: 40,
      baseFee: 22,
      priorityFee: 2,
      history: [
        {"time": "2024-01-01T00:00:00Z", "price": 28},
        {"time": "2024-01-01T01:00:00Z", "price": 32},
        {"time": "2024-01-01T02:00:00Z", "price": 29},
        {"time": "2024-01-01T03:00:00Z", "price": 35},
        {"time": "2024-01-01T04:00:00Z", "price": 30}
      ]
    },
    polygon: {
      slow: 30,
      standard: 35,
      fast: 45,
      baseFee: 28,
      priorityFee: 3,
      history: [
        {"time": "2024-01-01T00:00:00Z", "price": 32},
        {"time": "2024-01-01T01:00:00Z", "price": 36},
        {"time": "2024-01-01T02:00:00Z", "price": 33},
        {"time": "2024-01-01T03:00:00Z", "price": 38},
        {"time": "2024-01-01T04:00:00Z", "price": 35}
      ]
    },
    arbitrum: {
      slow: 0.1,
      standard: 0.2,
      fast: 0.3,
      baseFee: 0.08,
      priorityFee: 0.02,
      history: [
        {"time": "2024-01-01T00:00:00Z", "price": 0.15},
        {"time": "2024-01-01T01:00:00Z", "price": 0.18},
        {"time": "2024-01-01T02:00:00Z", "price": 0.12},
        {"time": "2024-01-01T03:00:00Z", "price": 0.22},
        {"time": "2024-01-01T04:00:00Z", "price": 0.20}
      ]
    }
  },
  networks: {
    ethereum: {
      name: "Ethereum",
      symbol: "ETH",
      chainId: 1,
      rpcUrl: "https://mainnet.infura.io/v3/",
      color: "#627EEA",
      blockTime: 12,
      avgTxFee: 0.0045
    },
    polygon: {
      name: "Polygon",
      symbol: "MATIC",
      chainId: 137,
      rpcUrl: "https://polygon-rpc.com/",
      color: "#8247E5",
      blockTime: 2,
      avgTxFee: 0.0001
    },
    arbitrum: {
      name: "Arbitrum",
      symbol: "ETH",
      chainId: 42161,
      rpcUrl: "https://arb1.arbitrum.io/rpc",
      color: "#28A0F0",
      blockTime: 1,
      avgTxFee: 0.0003
    }
  },
  ethPrice: 3420.50,
  maticPrice: 0.23,
  transactionTypes: {
    "transfer": {"name": "ETH Transfer", "gasLimit": 21000},
    "erc20": {"name": "ERC-20 Transfer", "gasLimit": 65000},
    "swap": {"name": "DEX Swap", "gasLimit": 150000},
    "nft": {"name": "NFT Mint", "gasLimit": 85000}
  },
  historicalData: [
    {"timestamp": "2025-01-18T06:00:00Z", "open": 28, "high": 32, "low": 25, "close": 30, "volume": 1200},
    {"timestamp": "2025-01-18T07:00:00Z", "open": 30, "high": 35, "low": 28, "close": 33, "volume": 1350},
    {"timestamp": "2025-01-18T08:00:00Z", "open": 33, "high": 38, "low": 30, "close": 36, "volume": 1100},
    {"timestamp": "2025-01-18T09:00:00Z", "open": 36, "high": 42, "low": 34, "close": 40, "volume": 1450},
    {"timestamp": "2025-01-18T10:00:00Z", "open": 40, "high": 45, "low": 38, "close": 42, "volume": 1600}
  ],
  alerts: [],
  notifications: []
};

// Application state
let currentNetwork = 'ethereum';
let currentTimeframe = '1h';
let chartType = 'line';
let gasChart = null;
let updateInterval = null;
let walletConnected = false;
let walletAddress = null;
let balances = {
  ethereum: 0,
  arbitrum: 0
};

// DOM elements
const connectWalletBtn = document.getElementById('connect-wallet');
const walletInfo = document.getElementById('wallet-info');
const walletAddressEl = document.getElementById('wallet-address');
const ethBalanceEl = document.getElementById('eth-balance');
const arbBalanceEl = document.getElementById('arb-balance');
const networkButtons = document.querySelectorAll('.btn--network');
const timeframeButtons = document.querySelectorAll('[data-timeframe]');
const chartTypeSelect = document.getElementById('chart-type');
const simulateButton = document.getElementById('simulate-btn');
const setAlertButton = document.getElementById('set-alert-btn');
const ethPriceElement = document.getElementById('eth-price');
const lastUpdatedElement = document.getElementById('last-updated');
const notificationToast = document.getElementById('notification-toast');
const toastMessage = document.getElementById('toast-message');
const toastClose = document.getElementById('toast-close');

// Initialize application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
  });
} else {
  initializeApp();
}

function initializeApp() {
  setupEventListeners();
  updateGasPrices();
  updateNetworkStats();
  populateActivityList();
  initializeChart();
  startRealTimeUpdates();
  updateLastUpdated();
  checkMetaMaskConnection();
  
  // Initialize ETH price display
  if (ethPriceElement) {
    ethPriceElement.textContent = `$${appData.ethPrice.toLocaleString()}`;
  }
  
  // Set default values for form
  const amountInput = document.getElementById('tx-amount');
  if (amountInput) {
    amountInput.value = '1.0';
  }
  
  // Set default alert threshold
  const alertThreshold = document.getElementById('alert-threshold');
  if (alertThreshold) {
    alertThreshold.value = '25';
  }
}

function setupEventListeners() {
  // MetaMask connection
  if (connectWalletBtn) {
    connectWalletBtn.addEventListener('click', toggleWalletConnection);
  }

  // Network switching
  networkButtons.forEach(button => {
    button.addEventListener('click', function() {
      const network = this.dataset.network;
      switchNetwork(network);
    });
  });

  // Timeframe switching
  timeframeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const timeframe = this.dataset.timeframe;
      switchTimeframe(timeframe);
    });
  });

  // Chart type switching
  if (chartTypeSelect) {
    chartTypeSelect.addEventListener('change', function() {
      chartType = this.value;
      console.log('Chart type changed to:', chartType);
      updateChart();
    });
  }

  // Transaction simulation
  if (simulateButton) {
    simulateButton.addEventListener('click', simulateTransaction);
  }

  // Alert setting
  if (setAlertButton) {
    setAlertButton.addEventListener('click', setGasAlert);
  }

  // Toast notification close
  if (toastClose) {
    toastClose.addEventListener('click', hideNotification);
  }

  // Form input changes
  const txTypeSelect = document.getElementById('tx-type');
  const gasPrioritySelect = document.getElementById('gas-priority');
  const amountInput = document.getElementById('tx-amount');
  const alertThresholdInput = document.getElementById('alert-threshold');
  
  if (txTypeSelect) {
    txTypeSelect.addEventListener('change', function() {
      console.log('Transaction type changed to:', this.value);
      updateSimulationPreview();
    });
  }
  
  if (gasPrioritySelect) {
    gasPrioritySelect.addEventListener('change', function() {
      console.log('Gas priority changed to:', this.value);
      updateSimulationPreview();
    });
  }
  
  if (amountInput) {
    amountInput.addEventListener('input', function() {
      console.log('Amount changed to:', this.value);
      updateSimulationPreview();
    });
  }
  
  if (alertThresholdInput) {
    alertThresholdInput.addEventListener('input', function() {
      console.log('Alert threshold changed to:', this.value);
    });
  }

  // MetaMask account change listener
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
  }
}

// MetaMask Integration Functions
async function checkMetaMaskConnection() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        walletConnected = true;
        walletAddress = accounts[0];
        updateWalletUI();
        await fetchBalances();
      }
    } catch (error) {
      console.error('Error checking MetaMask connection:', error);
    }
  }
}

async function toggleWalletConnection() {
  if (walletConnected) {
    disconnectWallet();
  } else {
    await connectWallet();
  }
}

async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        walletConnected = true;
        walletAddress = accounts[0];
        updateWalletUI();
        await fetchBalances();
        showNotification('MetaMask connected successfully!', 'success');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      showNotification('Failed to connect MetaMask', 'error');
    }
  } else {
    showNotification('MetaMask not found. Please install MetaMask.', 'error');
  }
}

function disconnectWallet() {
  walletConnected = false;
  walletAddress = null;
  balances = { ethereum: 0, arbitrum: 0 };
  updateWalletUI();
  showNotification('Wallet disconnected', 'info');
}

function updateWalletUI() {
  if (walletConnected && walletAddress) {
    if (connectWalletBtn) {
      connectWalletBtn.textContent = 'Disconnect Wallet';
      connectWalletBtn.classList.add('wallet-connected');
    }
    if (walletInfo) {
      walletInfo.style.display = 'block';
    }
    if (walletAddressEl) {
      walletAddressEl.textContent = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    }
    if (ethBalanceEl) {
      ethBalanceEl.textContent = balances.ethereum.toFixed(4);
    }
    if (arbBalanceEl) {
      arbBalanceEl.textContent = balances.arbitrum.toFixed(4);
    }
  } else {
    if (connectWalletBtn) {
      connectWalletBtn.textContent = 'Connect MetaMask';
      connectWalletBtn.classList.remove('wallet-connected');
    }
    if (walletInfo) {
      walletInfo.style.display = 'none';
    }
  }
}

async function fetchBalances() {
  if (!walletConnected || !walletAddress) return;

  try {
    // Fetch Ethereum balance
    const ethBalance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [walletAddress, 'latest']
    });
    balances.ethereum = parseInt(ethBalance, 16) / Math.pow(10, 18);

    // For Arbitrum, we'd need to switch networks or use a different RPC
    // For demo purposes, we'll simulate the balance
    balances.arbitrum = balances.ethereum * 0.8; // Simulated balance

    updateWalletUI();
  } catch (error) {
    console.error('Error fetching balances:', error);
    // Use mock data for demo
    balances.ethereum = 2.5;
    balances.arbitrum = 1.8;
    updateWalletUI();
  }
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    disconnectWallet();
  } else {
    walletAddress = accounts[0];
    updateWalletUI();
    fetchBalances();
  }
}

function handleChainChanged(chainId) {
  console.log('Chain changed:', chainId);
  // Refresh the page to avoid issues
  window.location.reload();
}

// Chart Functions
function initializeChart() {
  const canvas = document.getElementById('gas-chart');
  if (!canvas) {
    console.error('Chart canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  
  // @ts-ignore
  gasChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Gas Price (gwei)',
        data: [],
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'hour'
          },
          grid: {
            color: 'rgba(119, 124, 124, 0.2)'
          },
          ticks: {
            color: 'rgba(167, 169, 169, 0.7)'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(119, 124, 124, 0.2)'
          },
          ticks: {
            color: 'rgba(167, 169, 169, 0.7)',
            callback: function(value) {
              return value + ' gwei';
            }
          }
        }
      }
    }
  });
  
  updateChart();
}

function updateChart() {
  if (!gasChart) return;

  const network = appData.gasData[currentNetwork];
  if (!network) return;

  if (chartType === 'candlestick') {
    gasChart.destroy();
    createCandlestickChart();
  } else if (chartType === 'bar') {
    gasChart.destroy();
    createBarChart();
  } else {
    const chartData = appData.historicalData.map(point => ({
      x: new Date(point.timestamp),
      y: point.close
    }));
    
    gasChart.data.datasets[0].data = chartData;
    gasChart.data.datasets[0].borderColor = appData.networks[currentNetwork].color;
    gasChart.data.datasets[0].backgroundColor = `${appData.networks[currentNetwork].color}20`;
    gasChart.update();
  }
}

function createCandlestickChart() {
  const canvas = document.getElementById('gas-chart');
  const ctx = canvas.getContext('2d');
  
  const candlestickData = appData.historicalData.map(point => ({
    x: new Date(point.timestamp),
    y: [point.open, point.high, point.low, point.close]
  }));

  // @ts-ignore
  gasChart = new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: [{
        label: 'Gas Price (gwei)',
        data: candlestickData,
        backgroundColor: function(context) {
          const point = appData.historicalData[context.dataIndex];
          return point.close >= point.open ? '#1FB8CD' : '#FFC185';
        },
        borderColor: '#1FB8CD',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'hour'
          },
          grid: {
            color: 'rgba(119, 124, 124, 0.2)'
          },
          ticks: {
            color: 'rgba(167, 169, 169, 0.7)'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(119, 124, 124, 0.2)'
          },
          ticks: {
            color: 'rgba(167, 169, 169, 0.7)',
            callback: function(value) {
              return value + ' gwei';
            }
          }
        }
      }
    }
  });
}

function createBarChart() {
  const canvas = document.getElementById('gas-chart');
  const ctx = canvas.getContext('2d');
  
  const barData = appData.historicalData.map(point => ({
    x: new Date(point.timestamp),
    y: point.volume
  }));

  // @ts-ignore
  gasChart = new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: [{
        label: 'Transaction Volume',
        data: barData,
        backgroundColor: '#1FB8CD',
        borderColor: '#1FB8CD',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'hour'
          },
          grid: {
            color: 'rgba(119, 124, 124, 0.2)'
          },
          ticks: {
            color: 'rgba(167, 169, 169, 0.7)'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(119, 124, 124, 0.2)'
          },
          ticks: {
            color: 'rgba(167, 169, 169, 0.7)'
          }
        }
      }
    }
  });
}

// Gas Price Functions
function switchNetwork(network) {
  currentNetwork = network;
  
  // Update active button
  networkButtons.forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`[data-network="${network}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
  
  // Update display
  updateGasPrices();
  updateNetworkStats();
  updateChart();
}

function switchTimeframe(timeframe) {
  currentTimeframe = timeframe;
  
  // Update active button
  timeframeButtons.forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`[data-timeframe="${timeframe}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
  
  // Update chart
  updateChart();
}

function updateGasPrices() {
  const gasData = appData.gasData[currentNetwork];
  if (!gasData) return;
  
  const ethPrice = appData.ethPrice;
  const maticPrice = appData.maticPrice;
  
  const currentPrice = currentNetwork === 'polygon' ? maticPrice : ethPrice;
  
  // Update gas price displays
  const slowPrice = document.getElementById('slow-price');
  const standardPrice = document.getElementById('standard-price');
  const fastPrice = document.getElementById('fast-price');
  
  if (slowPrice) slowPrice.textContent = gasData.slow;
  if (standardPrice) standardPrice.textContent = gasData.standard;
  if (fastPrice) fastPrice.textContent = gasData.fast;
  
  // Update USD conversions
  const slowUsd = document.getElementById('slow-usd');
  const standardUsd = document.getElementById('standard-usd');
  const fastUsd = document.getElementById('fast-usd');
  
  if (slowUsd) slowUsd.textContent = calculateUSDGasFee(gasData.slow, 21000, currentPrice);
  if (standardUsd) standardUsd.textContent = calculateUSDGasFee(gasData.standard, 21000, currentPrice);
  if (fastUsd) fastUsd.textContent = calculateUSDGasFee(gasData.fast, 21000, currentPrice);
}

function updateNetworkStats() {
  const network = appData.networks[currentNetwork];
  const gasData = appData.gasData[currentNetwork];
  if (!network || !gasData) return;
  
  const blockTime = document.getElementById('block-time');
  const baseFee = document.getElementById('base-fee');
  const currentNetworkEl = document.getElementById('current-network');
  
  if (blockTime) blockTime.textContent = `${network.blockTime}s`;
  if (baseFee) baseFee.textContent = `${gasData.baseFee} gwei`;
  if (currentNetworkEl) currentNetworkEl.textContent = network.name;
}

function calculateUSDGasFee(gasPriceGwei, gasLimit, tokenPrice) {
  if (currentNetwork === 'arbitrum') {
    // Arbitrum uses different units
    const feeInUSD = gasPriceGwei * gasLimit * tokenPrice / 1000000;
    return `$${feeInUSD.toFixed(4)}`;
  } else {
    const gasPriceEth = gasPriceGwei / 1000000000; // Convert gwei to ETH
    const feeInEth = gasPriceEth * gasLimit;
    const feeInUSD = feeInEth * tokenPrice;
    return `$${feeInUSD.toFixed(2)}`;
  }
}

// Transaction Simulation
function simulateTransaction() {
  const txTypeSelect = document.getElementById('tx-type');
  const amountInput = document.getElementById('tx-amount');
  const gasPrioritySelect = document.getElementById('gas-priority');
  
  if (!txTypeSelect || !amountInput || !gasPrioritySelect) {
    console.error('Form elements not found');
    return;
  }
  
  const txType = txTypeSelect.value;
  const amount = parseFloat(amountInput.value) || 1;
  const gasPriority = gasPrioritySelect.value;
  
  console.log('Simulating transaction:', { txType, amount, gasPriority });
  
  const network = appData.networks[currentNetwork];
  const gasData = appData.gasData[currentNetwork];
  const txConfig = appData.transactionTypes[txType];
  
  if (!network || !gasData || !txConfig) {
    console.error('Configuration not found:', { network, gasData, txConfig });
    return;
  }
  
  const gasPrice = gasData[gasPriority];
  const currentPrice = currentNetwork === 'polygon' ? appData.maticPrice : appData.ethPrice;
  
  // Calculate results
  const gasLimit = txConfig.gasLimit;
  const totalFee = calculateUSDGasFee(gasPrice, gasLimit, currentPrice);
  const totalCost = amount * currentPrice + parseFloat(totalFee.replace('$', ''));
  
  console.log('Simulation results:', { gasLimit, gasPrice, totalFee, totalCost });
  
  // Update results display
  const resultGasLimit = document.getElementById('result-gas-limit');
  const resultGasPrice = document.getElementById('result-gas-price');
  const resultTotalFee = document.getElementById('result-total-fee');
  const resultTotalCost = document.getElementById('result-total-cost');
  
  if (resultGasLimit) resultGasLimit.textContent = gasLimit.toLocaleString();
  if (resultGasPrice) resultGasPrice.textContent = `${gasPrice} gwei`;
  if (resultTotalFee) resultTotalFee.textContent = totalFee;
  if (resultTotalCost) resultTotalCost.textContent = `$${totalCost.toFixed(2)}`;
  
  // Show results
  const simulationResults = document.getElementById('simulation-results');
  if (simulationResults) {
    simulationResults.style.display = 'block';
  }
  
  // Add activity item
  addActivityItem({
    type: txType,
    network: currentNetwork,
    amount: `${amount} ${network.symbol}`,
    fee: totalFee,
    status: 'simulated'
  });
}

function updateSimulationPreview() {
  const amountInput = document.getElementById('tx-amount');
  if (amountInput && amountInput.value) {
    simulateTransaction();
  }
}

// Gas Price Alerts
function setGasAlert() {
  const thresholdInput = document.getElementById('alert-threshold');
  const alertTypeSelect = document.getElementById('alert-type');
  
  if (!thresholdInput || !alertTypeSelect) {
    console.error('Alert form elements not found');
    return;
  }
  
  const threshold = parseFloat(thresholdInput.value);
  const alertType = alertTypeSelect.value;
  
  console.log('Setting alert:', { threshold, alertType });
  
  if (isNaN(threshold) || threshold <= 0) {
    showNotification('Please enter a valid threshold value', 'error');
    return;
  }
  
  const alert = {
    network: currentNetwork,
    threshold: threshold,
    type: alertType,
    active: true
  };
  
  appData.alerts.push(alert);
  updateAlertsDisplay();
  showNotification(`Alert set: ${alertType} ${threshold} gwei on ${currentNetwork}`, 'success');
  
  // Clear form
  thresholdInput.value = '';
}

function updateAlertsDisplay() {
  const activeAlerts = document.getElementById('active-alerts');
  if (!activeAlerts) return;
  
  activeAlerts.innerHTML = '';
  
  if (appData.alerts.length === 0) {
    activeAlerts.innerHTML = '<div class="alert-item"><span class="alert-text">No active alerts</span></div>';
    return;
  }
  
  appData.alerts.forEach((alert, index) => {
    const alertItem = document.createElement('div');
    alertItem.className = 'alert-item';
    alertItem.innerHTML = `
      <span class="alert-text">Alert when ${alert.network} gas ${alert.type} ${alert.threshold} gwei</span>
      <span class="status ${alert.active ? 'status--success' : 'status--warning'}">${alert.active ? 'Active' : 'Triggered'}</span>
    `;
    activeAlerts.appendChild(alertItem);
  });
}

function checkAlerts() {
  const gasData = appData.gasData[currentNetwork];
  if (!gasData) return;
  
  appData.alerts.forEach(alert => {
    if (alert.network === currentNetwork && alert.active) {
      const currentPrice = gasData.standard;
      
      if ((alert.type === 'below' && currentPrice < alert.threshold) ||
          (alert.type === 'above' && currentPrice > alert.threshold)) {
        showNotification(`Gas price alert: ${currentNetwork} gas is ${alert.type} ${alert.threshold} gwei`, 'info');
        alert.active = false; // Disable alert after triggering
        updateAlertsDisplay();
      }
    }
  });
}

// Activity and Notifications
function populateActivityList() {
  const activityList = document.getElementById('activity-list');
  if (!activityList) return;
  
  activityList.innerHTML = '';
  
  const activities = [
    {"type": "transfer", "network": "ethereum", "amount": "0.5 ETH", "fee": "$2.34", "status": "success"},
    {"type": "erc20", "network": "polygon", "amount": "1000 USDC", "fee": "$0.02", "status": "success"},
    {"type": "swap", "network": "arbitrum", "amount": "1 ETH → 2500 USDC", "fee": "$0.15", "status": "pending"},
    {"type": "nft", "network": "ethereum", "amount": "CryptoPunk #1234", "fee": "$1.89", "status": "success"}
  ];
  
  activities.forEach(activity => {
    addActivityItem(activity);
  });
}

function addActivityItem(activity) {
  const activityList = document.getElementById('activity-list');
  if (!activityList) return;
  
  const activityItem = document.createElement('div');
  activityItem.className = 'activity-item';
  
  const networkColor = appData.networks[activity.network]?.color || '#666';
  const statusClass = activity.status === 'success' ? 'success' : 
                     activity.status === 'pending' ? 'pending' : 'info';
  
  activityItem.innerHTML = `
    <div class="activity-icon" style="background-color: ${networkColor};">
      ${getActivityIcon(activity.type)}
    </div>
    <div class="activity-details">
      <div class="activity-type">${activity.type}</div>
      <div class="activity-amount">${activity.amount}</div>
    </div>
    <div class="activity-meta">
      <div class="activity-fee">${activity.fee}</div>
      <div class="activity-status ${statusClass}">${activity.status}</div>
    </div>
  `;
  
  activityList.insertBefore(activityItem, activityList.firstChild);
  
  // Keep only last 10 items
  while (activityList.children.length > 10) {
    activityList.removeChild(activityList.lastChild);
  }
}

function getActivityIcon(type) {
  const icons = {
    transfer: '💸',
    erc20: '🪙',
    swap: '🔄',
    nft: '🖼️',
    simulated: '🎯'
  };
  return icons[type] || '📊';
}

function showNotification(message, type = 'info') {
  if (!notificationToast || !toastMessage) return;
  
  toastMessage.textContent = message;
  notificationToast.classList.add('show');
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideNotification();
  }, 5000);
}

function hideNotification() {
  if (notificationToast) {
    notificationToast.classList.remove('show');
  }
}

// Real-time Updates
function startRealTimeUpdates() {
  // Update every 5 seconds
  updateInterval = setInterval(() => {
    simulateRealTimeUpdate();
    updateLastUpdated();
    checkAlerts();
  }, 5000);
}

function simulateRealTimeUpdate() {
  // Simulate small changes in gas prices
  Object.keys(appData.gasData).forEach(network => {
    const gasData = appData.gasData[network];
    const variation = 0.1; // 10% variation
    
    Object.keys(gasData).forEach(priority => {
      if (priority === 'history') return;
      
      const basePrice = gasData[priority];
      const change = (Math.random() - 0.5) * 2 * variation;
      let newPrice = basePrice + (basePrice * change);
      
      // Ensure minimum values
      if (network === 'arbitrum') {
        newPrice = Math.max(0.01, newPrice);
      } else {
        newPrice = Math.max(1, newPrice);
      }
      
      gasData[priority] = Math.round(newPrice * 10) / 10;
    });
  });
  
  // Simulate ETH price changes
  const ethChange = (Math.random() - 0.5) * 0.02; // 2% variation
  appData.ethPrice += appData.ethPrice * ethChange;
  appData.ethPrice = Math.round(appData.ethPrice * 100) / 100;
  
  // Update displays
  updateGasPrices();
  if (ethPriceElement) {
    ethPriceElement.textContent = `$${appData.ethPrice.toLocaleString()}`;
  }
  
  // Add pulsing effect to updated elements
  document.querySelectorAll('.gas-price .price').forEach(el => {
    el.classList.add('loading');
    setTimeout(() => el.classList.remove('loading'), 1000);
  });
  
  // Update balances if wallet is connected
  if (walletConnected) {
    fetchBalances();
  }
}

function updateLastUpdated() {
  if (!lastUpdatedElement) return;
  
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  lastUpdatedElement.textContent = timeString;
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
