
import { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {signInStart, signInSuccess, signInFailure} from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const {loading, error} = useSelector((state) => state.user) //global state name is user in userSlice.js 
  // const [error, setError] = useState(null)
  // const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) =>{
    setFormData({
      ...formData,  
      [e.target.id]:e.target.value
    })
  }
  const handleSubmit =async (e) =>{
    e.preventDefault(); //prevent of refresh of page when signup is clicked
    try {
        dispatch(signInStart())     //setLoading(true)
      const res = await fetch('/api/auth/signin', {
        method:'POST',
        headers:{
          'content-type':'application/json'
        },
        body:JSON.stringify(formData)
      })
      const data =await res.json()
      if(data.success === false){
        dispatch(signInFailure(data.message)); //in place of below two lines this is used
        // setLoading(false);
        // setError(data.message);
        return;
      }
      //if no error comes
      // setLoading(false);
      // setError(null);
      dispatch(signInSuccess(data)) //in place of above two lines this is used
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));  //in place of below two lines this is used
      // setLoading(false);
      //   setError(error.message);
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={handleChange} type="email" placeholder='email' className='border p-3 rounded-lg' id='email' />
        <input onChange={handleChange} type="password" placeholder='password' className='border p-3 rounded-lg' id='password' />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'loading...':'Sign In'}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
