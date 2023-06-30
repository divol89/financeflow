"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9474],{46659:function(t,r,e){e.d(r,{S:function(){return n}});var a=e(17249),s=e(10706);class n{get chainId(){return this._chainId}constructor(t,r,e){(0,a._)(this,"contractWrapper",void 0),(0,a._)(this,"storage",void 0),(0,a._)(this,"erc721",void 0),(0,a._)(this,"_chainId",void 0),(0,a._)(this,"transfer",(0,s.cZ)(async(t,r)=>this.erc721.transfer.prepare(t,r))),(0,a._)(this,"setApprovalForAll",(0,s.cZ)(async(t,r)=>this.erc721.setApprovalForAll.prepare(t,r))),(0,a._)(this,"setApprovalForToken",(0,s.cZ)(async(t,r)=>s.aV.fromContractWrapper({contractWrapper:this.contractWrapper,method:"approve",args:[await (0,s.cj)(t),r]}))),this.contractWrapper=t,this.storage=r,this.erc721=new s.au(this.contractWrapper,this.storage,e),this._chainId=e}onNetworkUpdated(t){this.contractWrapper.updateSignerOrProvider(t)}getAddress(){return this.contractWrapper.readContract.address}async getAll(t){return this.erc721.getAll(t)}async getOwned(t){return t&&(t=await (0,s.cj)(t)),this.erc721.getOwned(t)}async getOwnedTokenIds(t){return t&&(t=await (0,s.cj)(t)),this.erc721.getOwnedTokenIds(t)}async totalSupply(){return this.erc721.totalCirculatingSupply()}async get(t){return this.erc721.get(t)}async ownerOf(t){return this.erc721.ownerOf(t)}async balanceOf(t){return this.erc721.balanceOf(t)}async balance(){return this.erc721.balance()}async isApproved(t,r){return this.erc721.isApproved(t,r)}}},69474:function(t,r,e){e.r(r),e.d(r,{NFTCollection:function(){return c}});var a=e(17249),s=e(10706),n=e(46659),i=e(9279);e(13550),e(2162),e(64063),e(62822),e(71770),e(54098);class c extends n.S{constructor(t,r,e){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},i=arguments.length>4?arguments[4]:void 0,o=arguments.length>5?arguments[5]:void 0,h=arguments.length>6&&void 0!==arguments[6]?arguments[6]:new s.d6(t,r,i,n);super(h,e,o),(0,a._)(this,"abi",void 0),(0,a._)(this,"metadata",void 0),(0,a._)(this,"app",void 0),(0,a._)(this,"roles",void 0),(0,a._)(this,"encoder",void 0),(0,a._)(this,"estimator",void 0),(0,a._)(this,"events",void 0),(0,a._)(this,"sales",void 0),(0,a._)(this,"platformFees",void 0),(0,a._)(this,"royalties",void 0),(0,a._)(this,"owner",void 0),(0,a._)(this,"signature",void 0),(0,a._)(this,"interceptor",void 0),(0,a._)(this,"mint",(0,s.cZ)(async t=>this.erc721.mint.prepare(t))),(0,a._)(this,"mintTo",(0,s.cZ)(async(t,r)=>this.erc721.mintTo.prepare(t,r))),(0,a._)(this,"mintBatch",(0,s.cZ)(async t=>this.erc721.mintBatch.prepare(t))),(0,a._)(this,"mintBatchTo",(0,s.cZ)(async(t,r)=>this.erc721.mintBatchTo.prepare(t,r))),(0,a._)(this,"burn",(0,s.cZ)(t=>this.erc721.burn.prepare(t))),this.abi=s.e.parse(i||[]),this.metadata=new s.ag(this.contractWrapper,s.dn,this.storage),this.app=new s.a$(this.contractWrapper,this.metadata,this.storage),this.roles=new s.ah(this.contractWrapper,c.contractRoles),this.royalties=new s.ai(this.contractWrapper,this.metadata),this.sales=new s.aj(this.contractWrapper),this.encoder=new s.af(this.contractWrapper),this.estimator=new s.aP(this.contractWrapper),this.events=new s.aQ(this.contractWrapper),this.platformFees=new s.aS(this.contractWrapper),this.interceptor=new s.aR(this.contractWrapper),this.signature=new s.aD(this.contractWrapper,this.storage),this.owner=new s.aU(this.contractWrapper)}onNetworkUpdated(t){this.contractWrapper.updateSignerOrProvider(t)}getAddress(){return this.contractWrapper.readContract.address}async isTransferRestricted(){let t=await this.contractWrapper.readContract.hasRole((0,s.bA)("transfer"),i.d);return!t}async getMintTransaction(t,r){return this.erc721.getMintTransaction(t,r)}async prepare(t,r,e){return s.aV.fromContractWrapper({contractWrapper:this.contractWrapper,method:t,args:r,overrides:e})}async call(t,r,e){return this.contractWrapper.call(t,r,e)}}(0,a._)(c,"contractRoles",["admin","minter","transfer"])}}]);