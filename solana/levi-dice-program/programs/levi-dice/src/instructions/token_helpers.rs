use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, CloseAccount, Mint, TokenAccount, TransferChecked};

use crate::LEVI_DECIMALS;

pub fn transfer_checked<'info>(
    from: AccountInfo<'info>,
    mint: AccountInfo<'info>,
    to: AccountInfo<'info>,
    authority: AccountInfo<'info>,
    token_program: AccountInfo<'info>,
    amount: u64,
    signer_seeds: Option<&[&[&[u8]]]>,
) -> Result<()> {
    let accounts = TransferChecked {
        from,
        mint,
        to,
        authority,
    };
    let cpi = CpiContext::new(token_program, accounts);
    match signer_seeds {
        Some(seeds) => {
            token_interface::transfer_checked(cpi.with_signer(seeds), amount, LEVI_DECIMALS)
        }
        None => token_interface::transfer_checked(cpi, amount, LEVI_DECIMALS),
    }
}

pub fn close_token_account<'info>(
    account: AccountInfo<'info>,
    destination: AccountInfo<'info>,
    authority: AccountInfo<'info>,
    token_program: AccountInfo<'info>,
    signer_seeds: &[&[&[u8]]],
) -> Result<()> {
    let accounts = CloseAccount {
        account,
        destination,
        authority,
    };
    token_interface::close_account(
        CpiContext::new(token_program, accounts).with_signer(signer_seeds),
    )
}

pub fn assert_token_account(account: &TokenAccount, owner: &Pubkey, mint: &Pubkey) -> Result<()> {
    require_keys_eq!(
        account.owner,
        *owner,
        crate::LeviDiceError::InvalidRefundAccounts
    );
    require_keys_eq!(account.mint, *mint, crate::LeviDiceError::InvalidLeviMint);
    Ok(())
}

#[allow(dead_code)]
pub fn assert_mint(mint: &InterfaceAccount<Mint>) -> Result<()> {
    require_keys_eq!(
        mint.key(),
        crate::LEVI_MINT,
        crate::LeviDiceError::InvalidLeviMint
    );
    Ok(())
}
