const auction = artifacts.require('./QuizApp.sol')
const assert = require('assert')

let contractInstance

  contract('quizapp',  (accounts) => {
    beforeEach(async () => {
      contractInstance = await auction.deployed()
    })
    for(i=1;i<5;i++){
      const z = i;
      it('Check if participant is getting registered', async() => {
        var prevcnt  = await contractInstance.get_current_participant_count()      
        try{
          await contractInstance.regester_as_participant(20,{from: accounts[z]})
        }
        catch(err){
        }
        var newcnt  = await contractInstance.get_current_participant_count()            
        assert.equal(prevcnt.c[0]+1,newcnt.c[0], 'Participant is not registered')
    
      })
    }
    it('Check if same participant is not getting registered again', async() => {
      var prevcnt  = await contractInstance.get_current_participant_count()
      try{
        await contractInstance.regester_as_participant(20,{from: accounts[1]})
      }
      catch(err){
        // console.log(err)
      }
      var newcnt  = await contractInstance.get_current_participant_count()
      assert.equal(prevcnt.c[0],newcnt.c[0], 'Duplicate participant is registered')
    })
    it('Check if participant is not organizer', async() => {
      var prevcnt  = await contractInstance.get_current_participant_count()
      try{
        await contractInstance.regester_as_participant(20,{from: accounts[0]})
      }
      catch(err){
        // console.log(err)
      }
      var newcnt  = await contractInstance.get_current_participant_count()
      assert.equal(prevcnt.c[0],newcnt.c[0], 'Organizer registered as participant')
    })
    it('Check if participant is not getting registered on paying less than participation fees', async() => {
      var prevcnt  = await contractInstance.get_current_participant_count()
      try{
        await contractInstance.regester_as_participant(7,{from: accounts[5]})
      }
      catch(err){
        // console.log(err)
      }
      var newcnt  = await contractInstance.get_current_participant_count()
      assert.equal(prevcnt.c[0],newcnt.c[0], 'participant registered with less than participation fees')
    })
    it('Check if participant can answer a question', async() => {
      var check_flag = 0;
      try{
        await contractInstance.play_game_question_answer(1,1,{from: accounts[1]})
        check_flag = 1;
      }
      catch(err){
        // console.log(err)
      }
      assert.equal(check_flag,1, 'Non participant answered a question')
    })
    it('Check if non participant cannot answer a question', async() => {
      var check_flag = 0;
      try{
        await contractInstance.play_game_question_answer(1,1,{from: accounts[5]})
        check_flag = 1;
      }
      catch(err){
        // console.log(err)
      }
      assert.equal(check_flag,0, 'Non participant answered a question')
    })
    it('Check if organizer cannot answer a question', async() => {
      var check_flag = 0;
      try{
        await contractInstance.play_game_question_answer(1,1,{from: accounts[0]})
        check_flag = 1;
      }
      catch(err){
        // console.log(err)
      }
      assert.equal(check_flag,0, 'Organizer answered a question')
    })
    it('Check balance update on correctly answering a question', async() => {
      var prev_balance = await contractInstance.show_balance({from: accounts[1]})
      var reward = await contractInstance.show_reward()
      try{
        await contractInstance.play_game_question_answer(1,1,{from: accounts[1]})
      }
      catch(err){
        // console.log(err)
      }
      var new_balance = await contractInstance.show_balance({from: accounts[1]})      
      assert.equal(prev_balance.c[0]+reward.c[0],new_balance.c[0], 'Balance not updated')
    })
    it('Check balance update on incorrectly answering a question', async() => {
      var prev_balance = await contractInstance.show_balance({from: accounts[1]})
      try{
        await contractInstance.play_game_question_answer(1,2,{from: accounts[1]})
      }
      catch(err){
        // console.log(err)
      }
      var new_balance = await contractInstance.show_balance({from: accounts[1]})      
      assert.equal(prev_balance.c[0],new_balance.c[0], 'Balance updated on incorrectly answering')
    })
    // var arr = [0,0,0,0,0,7,6,5,4];
    // // for(i = 5; i < 9; i+=1){
    //   // const z =  i;
    //   it('Check if bidder is not getting registered when insufficient amount is paid', async() => {     
    //     var prevcnt = await contractInstance.getbidder()
    //     try{
    //       await contractInstance.register_bidder([19,19],[1,2], 30, 9, {from: accounts[6], value: web3.toWei(0.000000000000000001,'ether')})
    //     }
    //     catch(err){

    //     }
    //     var newcnt = await contractInstance.getbidder()
    //     assert.equal(prevcnt.c[0], newcnt.c[0], 'Bidder is not registered')
    //     })
    //   it('Check if bidder is getting registered and contract balance is updated', async() => {     
    //     var prevcnt = await contractInstance.getbidder()
    //     await contractInstance.register_bidder([19,19],[1,2], 30, 11, {from: accounts[5], value: web3.toWei(0.000000000000000006,'ether')})
    //     var newcnt = await contractInstance.getbidder()
    //     var temp = await contractInstance.get_contract_balance();
    //     assert.equal(prevcnt.c[0] + 1, newcnt.c[0], 'Bidder is not registered')
    //     assert.equal(temp.c[0], 6, 'Balance not updated')
    //     })
    //   it('Check if bidder is getting registered', async() => {     
    //     var prevcnt = await contractInstance.getbidder()
    //     await contractInstance.register_bidder([19,19],[1,2], 30, 9, {from: accounts[6], value: web3.toWei(0.000000000000000002,'ether')})
    //     var newcnt = await contractInstance.getbidder()
    //     assert.equal(prevcnt.c[0] + 1, newcnt.c[0], 'Bidder is not registered')
    //     })
    //   it('Check if bidder is getting registered', async() => {     
    //     var prevcnt = await contractInstance.getbidder()
    //     await contractInstance.register_bidder([19,19],[4,3], 30, 10, {from: accounts[7], value: web3.toWei(0.000000000000000004,'ether')})
    //     var newcnt = await contractInstance.getbidder()
    //     assert.equal(prevcnt.c[0] + 1, newcnt.c[0], 'Bidder is not registered')
    //     })
    //   it('Check if bidder is getting registered', async() => {     
    //     var prevcnt = await contractInstance.getbidder()
    //     await contractInstance.register_bidder([19,19],[1,2], 30, 12, {from: accounts[8], value: web3.toWei(0.000000000000000008,'ether')})
    //     var newcnt = await contractInstance.getbidder()
    //     assert.equal(prevcnt.c[0] + 1, newcnt.c[0], 'Bidder is not registered')
    //     })
    // // }

    // it('Check if notary not registered on moderator', async() => {     
    //   var prevcnt = await contractInstance.getnotary()
    //   try {
    //     await contractInstance.register_notary({from: accounts[0]});
    //   }
    //   catch(err){
    //   }
    //   var newcnt = await contractInstance.getnotary()
    //   assert.equal(prevcnt.c[0] , newcnt.c[0], 'Bidder is not registered')
    // })

    // it('Check if bidder not registered on moderator', async() => {     
    //   var prevcnt = await contractInstance.getbidder()
    //   try {
    //     await contractInstance.register_bidder({from: accounts[0]});
    //   }
    //   catch(err){
    //   }
    //   var newcnt = await contractInstance.getbidder()
    //   assert.equal(prevcnt.c[0] , newcnt.c[0], 'Bidder is not registered')
    // })

    // it('Check if bidder not registered on notary', async() => {     
    //   var prevcnt = await contractInstance.getbidder()
    //   try {
    //     await contractInstance.register_bidder({from: accounts[2]});
    //   }
    //   catch(err){
    //   }
    //   var newcnt = await contractInstance.getbidder()
    //   assert.equal(prevcnt.c[0] , newcnt.c[0], 'Bidder is not registered')
    // })

    // it('Check if notary not registered on bidder', async() => {     
    //   var prevcnt = await contractInstance.getnotary()
    //   try {
    //     await contractInstance.register_notary({from: accounts[5]});
    //   }
    //   catch(err){
    //   }
    //   var newcnt = await contractInstance.getnotary()
    //   assert.equal(prevcnt.c[0] , newcnt.c[0], 'Bidder is not registered')
    // })

    // it('Only moderator can call winner', async() => {
    //   try{
    //     await contractInstance.declare_winners({from: accounts[0]});
    //     await contractInstance.allot_payments({from: accounts[0]});
    //     // console.log(temp);
    //     console.log("Emitted");     
    //   }
    //   catch(err){
    //     console.log(err);
    //   }
    // })

    // it('Declare winner', async() => {
    //   // var result=contractInstance.declare_winners({from: accounts[0]});
    // //  var arr= new Array();
    // //  for(i=0;i<4;i++){
    //   var temp=await contractInstance.get_winner_w1();
    //   console.log(temp);
    //   assert.equal(temp.c[0] , 12, 'Bidder is not registered')
      
    // //  }
    // })
    // it('Winners Pay for bidded items', async() => {
    //   var temp = await contractInstance.get_contract_balance();
    //   await contractInstance.get_items({from: accounts[8], value: web3.toWei(0.000000000000000002,'ether')});
    //   var temp2 = await contractInstance.get_contract_balance();
    //   assert.equal(temp.c[0], temp2.c[0]-6, 'Balance not deducted');     
    // //  }
    // })
    // it('The losing bidder cannot pay', async() => {
    //   var temp = await contractInstance.get_contract_balance();
    //   try{
    //   await contractInstance.get_items({from: accounts[5], value: web3.toWei(0.000000000000000010,'ether')});
    //   }
    //   catch(err){
    //   }     
    //   var temp2 = await contractInstance.get_contract_balance();
    //   assert.equal(temp.c[0], temp2.c[0], 'Balance not deducted');     

    // //  }
    // })
    // // it('The losing bidder withdraws', async() => {
    // //   var temp = await web3.eth.getBalance(accounts[5]);
    // //   console.log(web3.toWei(temp.c[0]));
    // //   try{
    // //   await contractInstance.withdraw_losing_bid({from: accounts[5]});
    // //   }
    // //   catch(err){
    // //   }     
    // //   var temp2 = await web3.eth.getBalance(accounts[5]);
    // //   console.log(web3.toWei(temp2.c[0]));
    // //   // var temp2 = await contractInstance.get_balance({from: accounts[5]});
    // //   // console.log(temp.c[0],temp2.c[0])
    // //   // assert.equal(temp.c[0] + 6, temp2.c[0], 'Balance not deducted');     
    // // //  }
    // // })
    // // it('Winners Pay for bidded items', async() => {
    // //   var temp = await contractInstance.get_contract_balance();
    // //   await contractInstance.check_intersection(1,2);
    // //   var temp2 = await contractInstance.get_contract_balance();
    // //   // assert.equal(temp.c[0], temp2.c[0]-10, 'Balance not deducted');     
    // // //  }
    // // })
})