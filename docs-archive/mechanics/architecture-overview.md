# Architecture Overview

This page sketches the high-level architecture of attn.  
Details may evolve; this is a working map for developers and integrators.

---

## 1. Core components

- **Revenue Accounts**
  - Squads Safe / multisig vaults on Solana that receive protocol and creator revenues.  
  - Host routing logic for repayment, base yield, and withdrawals.

- **Position Engine**
  - Responsible for:
    - creating and tracking advances and credit line draws,  
    - defining revenue share schedules and maturities,  
    - interfacing with yield-stripping infra (PT/YT).

- **PT/YT Layer**
  - Implemented on Exponent Finance’s Standardised Yield (SY) fixed-income infra:  
    - represent revenue-bearing positions as SY-like tokens,  
    - strip into PT and YT,  
    - expose them for vault accounting and potential secondary markets.

- **attnUSD Vault**
  - Holds stablecoins and PT/YT positions.  
  - Mints and burns attnUSD.  
  - Computes NAV and enforces portfolio limits.

- **Risk & Limits Engine**
  - Stores per-project and portfolio limits.  
  - Approves or rejects new positions based on risk data.  
  - Applies haircuts for pricing and NAV.

- **Offchain / Hybrid Services**
  - Monitoring:
    - revenue data feeds,  
    - health checks on routes and programs.  
  - Governance and operations:
    - parameter changes,  
    - manual interventions in emergencies.

---

## 2. Data flows (simplified)

1. **Revenue in**
   - Protocol / creator configures fee switch / rewards to flow into a Revenue Account.  
   - Revenue Account reports balances and flows to the Position Engine and Risk Engine.

2. **Position creation**
   - Project requests an advance or draw from a credit line.  
   - Risk Engine checks limits and parameters.  
   - Position Engine creates a new RBP and strips it into PT/YT via PT/YT Layer.  
   - attnUSD Vault (or another LP) purchases the YT leg; funds are sent to the project.

3. **Repayment and yield**
   - Incoming revenues are split according to routing rules.  
   - Cashflows allocated to each open position are tracked and credited against YT.  
   - Vault NAV updates based on realised flows and updated marks.

4. **Withdrawals and redemptions**
   - Projects withdraw unencumbered revenues from their Revenue Accounts.  
   - LPs deposit/withdraw from attnUSD, which adjusts vault holdings in stables and PT/YT.

Further diagrams and sequence charts can be added as the implementation solidifies.
