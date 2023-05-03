import { useQuery } from "react-query"
import { client } from "./api-client.exercise"

export const useListItems = ({user}) =>{
    const {data: listItems} = useQuery({
        queryKey: 'list-items',
        queryFn: () =>
          client('list-items', {token: user.token}).then(data =>
            data.listItems,
          ),
      })
      return listItems
}