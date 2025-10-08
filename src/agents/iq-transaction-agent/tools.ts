import { createTool } from "@iqai/adk"

export const getIqTransactionTool = createTool({
  name: "get_iq_transaction",
  description: "Get all transactions on IQ Agent trading platform",
  fn: async () => {
    try {
      const response = await fetch("https://app.iqai.com/all-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Next-Action": "7fe4da768a154fc96771c15ae4b610021c15da23b7"
        },
        body: JSON.stringify([0])
      });


      console.log(response);

      if (!response.ok) {
        return `Failed to fetch transactions: ${response.status} ${response.statusText}`;
      }

      const data = await response.json();


      console.log(data);

      return {
        transactions: "Transactions fetched successfully, you can return this to the user, I'm debuugging and that's fine",
      }
      
      // return JSON.stringify(data, null, 2);
    } catch (error) {
      return `Error fetching transactions: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
})